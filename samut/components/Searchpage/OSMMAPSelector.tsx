"use client"

import { useEffect, useRef, useState } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

const createCustomIcon = () => {
  return L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    shadowSize: [41, 41],
  })
}

interface TeacherLocation {
  id: number
  name: string
  location: {
    lat: number
    lng: number
    address?: string
  }
}

interface OSMMapSelectorProps {
  center?: { lat: number; lng: number };
  teachers?: TeacherLocation[]
  onLocationSelect: (location: { lat: number; lng: number }) => void
}

const OSMMapSelector = ({ teachers = [], onLocationSelect }: OSMMapSelectorProps) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<L.Map | null>(null)
  const markerRef = useRef<L.Marker | null>(null)

  const [center, setCenter] = useState({ lat: 13.7563, lng: 100.5018 }) // default: Bangkok
  
  useEffect(() => {
    // ลองดึงตำแหน่งผู้ใช้ ถ้าไม่ให้ใช้ default
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords
          setCenter({ lat: latitude, lng: longitude })
          onLocationSelect({ lat: latitude, lng: longitude })
        },
        () => {
          console.warn("Location permission denied or unavailable. Using default (Bangkok).")
        }
      )
    }
  }, [])

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return

    delete (L.Icon.Default.prototype as any)._getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    })

    mapInstance.current = L.map(mapRef.current).setView([center.lat, center.lng], 13)

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(mapInstance.current)

    markerRef.current = L.marker([center.lat, center.lng], {
      draggable: true,
    }).addTo(mapInstance.current)

    markerRef.current.on("dragend", (e) => {
      const { lat, lng } = e.target.getLatLng()
      onLocationSelect({ lat, lng })
    })

    mapInstance.current.on("click", (e) => {
      markerRef.current?.setLatLng(e.latlng)
      onLocationSelect(e.latlng)
    })
  }, [center.lat, center.lng])

  useEffect(() => {
    if (mapInstance.current) {
      mapInstance.current.setView([center.lat, center.lng], mapInstance.current.getZoom())
    }
    if (markerRef.current) {
      markerRef.current.setLatLng([center.lat, center.lng])
    }
  }, [center.lat, center.lng])

  return (
    <div
      ref={mapRef}
      style={{ height: "400px", width: "100%" }}
      className="z-10 bg-gray-100"
    />
  )
}

export default OSMMapSelector
