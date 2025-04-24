"use client"

import { useEffect, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

interface OSMMapSelectorProps {
  center: { lat: number; lng: number }
  onLocationSelect: (location: { lat: number; lng: number }) => void
}

const OSMMapSelector = ({ center, onLocationSelect }: OSMMapSelectorProps) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null)

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return

    

    // Fix for default marker icons
    delete (L.Icon.Default.prototype as any)._getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    })

    mapInstance.current = L.map(mapRef.current).setView([13.7563, 100.5018], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(mapInstance.current);

    markerRef.current = L.marker([center.lat, center.lng], {
      draggable: true
    }).addTo(mapInstance.current)

    markerRef.current.on("dragend", (e) => {
      const { lat, lng } = e.target.getLatLng()
      onLocationSelect({ lat, lng })
    })

    // ใน useEffect ของ OSMMapSelector
    mapInstance.current.on('click', (e) => {
    markerRef.current?.setLatLng(e.latlng);
    onLocationSelect(e.latlng);  // <-- ต้องส่งข้อมูลในรูปแบบที่ถูกต้อง
    });

    return () => {
        if (mapInstance.current) {
            mapInstance.current.remove();
            mapInstance.current = null;
          }
    }
  }, [center.lat, center.lng])

  return <div ref={mapRef} style={{ height: "400px", width: "100%" }} className="z-10 bg-gray-100"/>
}

export default OSMMapSelector