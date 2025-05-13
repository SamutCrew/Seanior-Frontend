"use client"

import { useEffect, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { useAppSelector } from "@/app/redux"

const createCustomIcon = () => {
  return L.icon({
    iconUrl: "/icons/marker-icon-red.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: "/icons/marker-shadow.png",
    shadowSize: [41, 41],
  })
}

const getMarkerIcon = (isDark: boolean) => {
  return L.icon({
    iconUrl: isDark ? "/icons/marker-icon-blue.png" : "/icons/marker-icon-red.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: "/icons/marker-shadow.png",
    shadowSize: [41, 41],
  })
}

interface LocationItem {
  id: number
  name: string
  location: {
    lat: number
    lng: number
    address?: string
  }
}

interface OSMMapSelectorProps {
  center?: { lat: number; lng: number }
  instructorLocations?: LocationItem[]
  courseLocations?: LocationItem[]
  onLocationSelect: (location: { lat: number; lng: number }) => void
  initialMarker?: { lat: number; lng: number } | null
}

const OSMMapSelector = ({
  instructorLocations = [],
  courseLocations = [],
  onLocationSelect,
  center,
  initialMarker,
}: OSMMapSelectorProps) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const markerRef = useRef<L.Marker | null>(null)
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode)

  // Store locations in refs to prevent re-renders
  const instructorLocationsRef = useRef(instructorLocations)
  const courseLocationsRef = useRef(courseLocations)
  const centerRef = useRef(center || { lat: 13.7563, lng: 100.5018 })

  // Track if map is initialized
  const isInitializedRef = useRef(false)

  // Initialize map only once
  useEffect(() => {
    // Update refs with new props
    instructorLocationsRef.current = instructorLocations
    courseLocationsRef.current = courseLocations
    if (center) centerRef.current = center

    // Only initialize map once
    if (mapRef.current && !isInitializedRef.current) {
      const map = L.map(mapRef.current).setView([centerRef.current.lat, centerRef.current.lng], 13)
      mapInstanceRef.current = map

      // Use a different tile layer for dark mode
      if (isDarkMode) {
        L.tileLayer("https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://stadiamaps.com/">Stadia Maps</a>',
          maxZoom: 20,
        }).addTo(map)
      } else {
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "© OpenStreetMap contributors",
        }).addTo(map)
      }

      // Create marker
      const markerPosition = initialMarker || centerRef.current
      markerRef.current = L.marker([markerPosition.lat, markerPosition.lng], {
        draggable: true,
        icon: getMarkerIcon(isDarkMode),
      }).addTo(map)

      // Set up event handlers
      markerRef.current.on("dragend", (e) => {
        const { lat, lng } = e.target.getLatLng()
        onLocationSelect({ lat, lng })
      })

      // Only update marker position on click, not reset the map
      map.on("click", (e) => {
        if (markerRef.current) {
          markerRef.current.setLatLng(e.latlng)
          onLocationSelect(e.latlng)
        }
      })

      // Add instructor and course markers
      addLocationMarkers(map)

      isInitializedRef.current = true

      // Clean up on unmount
      return () => {
        map.remove()
        mapInstanceRef.current = null
        markerRef.current = null
        isInitializedRef.current = false
      }
    }
  }, []) // Empty dependency array - only run once on mount

  // Function to add location markers
  const addLocationMarkers = (map: L.Map) => {
    // Add markers for instructors
    instructorLocationsRef.current.forEach((item) => {
      if (item.location && item.location.lat !== undefined && item.location.lng !== undefined) {
        L.marker([item.location.lat, item.location.lng], {
          icon: getMarkerIcon(isDarkMode),
        })
          .addTo(map)
          .bindPopup(`<strong>Instructor: ${item.name}</strong><br/>${item.location.address ?? ""}`)
      }
    })

    // Add markers for courses
    courseLocationsRef.current.forEach((item) => {
      if (item.location && item.location.lat !== undefined && item.location.lng !== undefined) {
        L.marker([item.location.lat, item.location.lng], {
          icon: getMarkerIcon(isDarkMode),
        })
          .addTo(map)
          .bindPopup(`<strong>Course: ${item.name}</strong><br/>${item.location.address ?? ""}`)
      }
    })
  }

  // Update marker position if center changes
  useEffect(() => {
    if (center && mapInstanceRef.current && markerRef.current) {
      // Only update if center actually changed
      if (centerRef.current.lat !== center.lat || centerRef.current.lng !== center.lng) {
        centerRef.current = center
        markerRef.current.setLatLng([center.lat, center.lng])
        mapInstanceRef.current.setView([center.lat, center.lng], 13, { animate: false })
      }
    }
  }, [center])

  // Handle dark mode changes
  useEffect(() => {
    if (mapInstanceRef.current && markerRef.current) {
      // Update marker icon when dark mode changes
      markerRef.current.setIcon(getMarkerIcon(isDarkMode))
    }
  }, [isDarkMode])

  return (
    <div
      ref={mapRef}
      style={{ height: "400px", width: "100%" }}
      className={`z-10 ${isDarkMode ? "bg-slate-800" : "bg-gray-100"}`}
    />
  )
}

export default OSMMapSelector
