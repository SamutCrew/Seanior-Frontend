"use client"

import { useEffect, useRef, useState } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

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
  teacherLocations?: LocationItem[]
  courseLocations?: LocationItem[]
  onLocationSelect: (location: { lat: number; lng: number }) => void
}

const OSMMapSelector = ({
  teacherLocations = [],
  courseLocations = [],
  onLocationSelect,
}: OSMMapSelectorProps) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<L.Map | null>(null)
  const markerRef = useRef<L.Marker | null>(null)

  const [center, setCenter] = useState({ lat: 13.7563, lng: 100.5018 }) // default: Bangkok

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords
          const userLocation = { lat: latitude, lng: longitude }
          setCenter(userLocation)
          onLocationSelect(userLocation)
        },
        () => {
          console.warn("Location permission denied or unavailable. Using default (Bangkok).")
        }
      )
    }
  }, [])

  useEffect(() => {
    if (!mapRef.current) return;
  
    // ❗️Remove existing map if re-creating
    if (mapInstance.current) {
      mapInstance.current.remove();
      mapInstance.current = null;
    }
  
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    });
  
    const map = L.map(mapRef.current).setView([center.lat, center.lng], 13);
    mapInstance.current = map;
  
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);
  
    markerRef.current = L.marker([center.lat, center.lng], {
      draggable: true,
    }).addTo(map);
  
    markerRef.current.on("dragend", (e) => {
      const { lat, lng } = e.target.getLatLng();
      onLocationSelect({ lat, lng });
    });
  
    map.on("click", (e) => {
      markerRef.current?.setLatLng(e.latlng);
      onLocationSelect(e.latlng);
    });
  
    // 🔹 Add markers for teachers
    teacherLocations.forEach((item) => {
      L.marker([item.location.lat, item.location.lng], {
        icon: createCustomIcon(),
      })
        .addTo(map)
        .bindPopup(`<strong>Teacher: ${item.name}</strong><br/>${item.location.address ?? ""}`);
    });
  
    // 🔹 Add markers for courses
    courseLocations.forEach((item) => {
      L.marker([item.location.lat, item.location.lng], {
        icon: createCustomIcon(),
      })
        .addTo(map)
        .bindPopup(`<strong>Course: ${item.name}</strong><br/>${item.location.address ?? ""}`);
    });
  
  }, [center.lat, center.lng, teacherLocations, courseLocations]);

  return (
    <div
      ref={mapRef}
      style={{ height: "400px", width: "100%" }}
      className="z-10 bg-gray-100"
    />
  )
}

export default OSMMapSelector
