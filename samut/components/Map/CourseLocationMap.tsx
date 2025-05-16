"use client"

import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"

// Fix for default marker icons in Leaflet with Next.js
const DefaultIcon = L.icon({
  iconUrl: "/marker-icon.png",
  shadowUrl: "/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

L.Marker.prototype.options.icon = DefaultIcon

// Component to handle map view updates
function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap()

  useEffect(() => {
    map.setView(center, map.getZoom())
  }, [center, map])

  return null
}

interface CourseLocationMapProps {
  location: {
    lat: number
    lng: number
    address: string
  }
  height?: string
  className?: string
}

export default function CourseLocationMap({ location, height = "400px", className = "" }: CourseLocationMapProps) {
  const [mapCenter, setMapCenter] = useState<[number, number]>([location.lat, location.lng])
  const [isClient, setIsClient] = useState(false)

  // Fix for hydration issues with Next.js
  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    setMapCenter([location.lat, location.lng])
  }, [location])

  if (!isClient) {
    return (
      <div className={`flex items-center justify-center bg-gray-200 rounded-lg ${className}`} style={{ height }}>
        <div className="text-center p-4">
          <p className="text-gray-500">Loading map...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={className} style={{ height }}>
      <MapContainer
        center={mapCenter}
        zoom={15}
        style={{ height: "100%", width: "100%", borderRadius: "0.5rem" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={mapCenter}>
          <Popup>
            <div className="text-sm">
              <strong>Course Location</strong>
              <br />
              {location.address}
            </div>
          </Popup>
        </Marker>
        <MapUpdater center={mapCenter} />
      </MapContainer>
    </div>
  )
}
