"use client"

import { useEffect, useRef, useState } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

interface OSMMapSelectorProps {
  center: { lat: number; lng: number }
  onLocationSelect: (location: { lat: number; lng: number }) => void
  forceLightMode?: boolean
  initialMarker?: { lat: number; lng: number }
  instructorLocations?: Array<{ lat: number; lng: number; name?: string }>
  courseLocations?: Array<{ lat: number; lng: number; title?: string }>
  height?: string
  zoom?: number
  allowDragging?: boolean
}

export default function OSMMapSelector({
  center = { lat: 13.7563, lng: 100.5018 },
  onLocationSelect,
  forceLightMode = false,
  initialMarker,
  instructorLocations = [],
  courseLocations = [],
  height = "400px",
  zoom = 13,
  allowDragging = true,
}: OSMMapSelectorProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<L.Map | null>(null)
  const markerRef = useRef<L.Marker | null>(null)
  const instructorMarkersRef = useRef<L.Marker[]>([])
  const courseMarkersRef = useRef<L.Marker[]>([])
  const [isMapInitialized, setIsMapInitialized] = useState(false)
  const isDarkMode = forceLightMode ? false : false // Replace with your dark mode detection

  // Create a custom marker icon
  const createMarkerIcon = (color = "#FF5252", size = 32) => {
    return L.divIcon({
      className: "custom-marker-icon",
      html: `<div style="
        background-color: ${color};
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 0 10px rgba(0,0,0,0.3);
        position: relative;
      ">
        <div style="
          position: absolute;
          bottom: -10px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          border-top: 10px solid ${color};
        "></div>
      </div>`,
      iconSize: [size, size],
      iconAnchor: [size / 2, size + 5],
    })
  }

  // Create a custom instructor marker icon
  const createInstructorIcon = () => {
    return L.divIcon({
      className: "instructor-marker-icon",
      html: `<div style="
        background-color: #4A90E2;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 0 5px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 12px;
      ">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      </div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    })
  }

  // Create a custom course marker icon
  const createCourseIcon = () => {
    return L.divIcon({
      className: "course-marker-icon",
      html: `<div style="
        background-color: #50C878;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 0 5px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 12px;
      ">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
        </svg>
      </div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    })
  }

  // Initialize the map
  useEffect(() => {
    if (mapRef.current && !mapInstance.current) {
      // Create map instance
      const map = L.map(mapRef.current, {
        center: [center.lat, center.lng],
        zoom: zoom,
        zoomControl: true,
        attributionControl: true,
      })

      // Add tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map)

      // Create a draggable marker with custom icon
      const marker = L.marker([center.lat, center.lng], {
        draggable: allowDragging,
        icon: createMarkerIcon(),
      }).addTo(map)

      // Use initialMarker if provided
      if (initialMarker) {
        marker.setLatLng([initialMarker.lat, initialMarker.lng])
        map.panTo([initialMarker.lat, initialMarker.lng])
      }

      // Handle marker drag events
      marker.on("dragend", (event) => {
        const position = marker.getLatLng()
        onLocationSelect({ lat: position.lat, lng: position.lng })
      })

      // Handle map click events
      map.on("click", (event) => {
        const position = event.latlng
        marker.setLatLng(position)
        onLocationSelect({ lat: position.lat, lng: position.lng })
      })

      // Add instructor markers if provided
      if (instructorLocations.length > 0) {
        instructorLocations.forEach((location) => {
          const instructorMarker = L.marker([location.lat, location.lng], {
            icon: createInstructorIcon(),
          }).addTo(map)

          if (location.name) {
            instructorMarker.bindTooltip(location.name)
          }

          instructorMarkersRef.current.push(instructorMarker)
        })
      }

      // Add course markers if provided
      if (courseLocations.length > 0) {
        courseLocations.forEach((location) => {
          const courseMarker = L.marker([location.lat, location.lng], {
            icon: createCourseIcon(),
          }).addTo(map)

          if (location.title) {
            courseMarker.bindTooltip(location.title)
          }

          courseMarkersRef.current.push(courseMarker)
        })
      }

      // Store references
      mapInstance.current = map
      markerRef.current = marker
      setIsMapInitialized(true)

      // Handle resize events
      const handleResize = () => {
        if (mapInstance.current) {
          mapInstance.current.invalidateSize()
        }
      }

      window.addEventListener("resize", handleResize)

      // Cleanup function
      return () => {
        window.removeEventListener("resize", handleResize)

        if (mapInstance.current) {
          mapInstance.current.remove()
          mapInstance.current = null
        }

        markerRef.current = null
        instructorMarkersRef.current = []
        courseMarkersRef.current = []
      }
    }
  }, [
    center.lat,
    center.lng,
    onLocationSelect,
    forceLightMode,
    initialMarker,
    instructorLocations,
    courseLocations,
    zoom,
    allowDragging,
  ])

  // Update marker position when center prop changes
  useEffect(() => {
    if (isMapInitialized && mapInstance.current && markerRef.current) {
      markerRef.current.setLatLng([center.lat, center.lng])
      mapInstance.current.panTo([center.lat, center.lng])
    }
  }, [center, isMapInitialized])

  return (
    <div
      ref={mapRef}
      style={{
        height: height,
        width: "100%",
        position: "relative",
        zIndex: 1,
      }}
      className="leaflet-container"
    />
  )
}
