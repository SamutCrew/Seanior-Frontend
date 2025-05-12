"use client"

import { useEffect, useRef, useState } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { useAppSelector } from "@/app/redux"

const createCustomIcon = () => {
  return L.icon({
    iconUrl: "/icons/marker-icon-red.png", // ✅ ไอคอนหลัก
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: "/icons/marker-shadow.png", // ✅ เงาไอคอน
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
}

const OSMMapSelector = ({
  instructorLocations = [],
  courseLocations = [],
  onLocationSelect,
  center,
}: OSMMapSelectorProps) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<L.Map | null>(null)
  const markerRef = useRef<L.Marker | null>(null)
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode)

  const [mapCenter, setMapCenter] = useState(center || { lat: 13.7563, lng: 100.5018 }) // default: Bangkok

  useEffect(() => {
    if (center) {
      setMapCenter(center)
    }
  }, [center])

  useEffect(() => {
    if (!mapRef.current) return

    // ❗️Remove existing map if re-creating
    if (mapInstance.current) {
      mapInstance.current.remove()
      mapInstance.current = null
    }

    delete (L.Icon.Default.prototype as any)._getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    })

    const map = L.map(mapRef.current).setView([mapCenter.lat, mapCenter.lng], 13)
    mapInstance.current = map

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

    markerRef.current = L.marker([mapCenter.lat, mapCenter.lng], {
      draggable: true,
      icon: getMarkerIcon(isDarkMode),
    }).addTo(map)

    markerRef.current.on("dragend", (e) => {
      const { lat, lng } = e.target.getLatLng()
      onLocationSelect({ lat, lng })
    })

    map.on("click", (e) => {
      markerRef.current?.setLatLng(e.latlng)
      onLocationSelect(e.latlng)
    })

    // 🔹 Add markers for instructors
    instructorLocations.forEach((item) => {
      if (item.location && item.location.lat !== undefined && item.location.lng !== undefined) {
        L.marker([item.location.lat, item.location.lng], {
          icon: getMarkerIcon(isDarkMode),
        })
          .addTo(map)
          .bindPopup(`<strong>Instructor: ${item.name}</strong><br/>${item.location.address ?? ""}`)
      }
    })

    // 🔹 Add markers for courses
    courseLocations.forEach((item) => {
      if (item.location && item.location.lat !== undefined && item.location.lng !== undefined) {
        L.marker([item.location.lat, item.location.lng], {
          icon: getMarkerIcon(isDarkMode),
        })
          .addTo(map)
          .bindPopup(`<strong>Course: ${item.name}</strong><br/>${item.location.address ?? ""}`)
      }
    })
  }, [mapCenter.lat, mapCenter.lng, instructorLocations, courseLocations, isDarkMode, onLocationSelect])

  return (
    <div
      ref={mapRef}
      style={{ height: "400px", width: "100%" }}
      className={`z-10 ${isDarkMode ? "bg-slate-800" : "bg-gray-100"}`}
    />
  )
}

export default OSMMapSelector
