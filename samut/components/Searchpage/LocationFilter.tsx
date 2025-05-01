"use client"

import { FaCrosshairs, FaMapMarkerAlt } from "react-icons/fa";
import { Location } from "../../types/teacher";
import OSMMapSelector from "./OSMMAPSelector";

interface LocationItem {
  id: number
  name: string
  location: {
    lat: number
    lng: number
    address?: string
  }
}

interface LocationFilterProps {
  isLoadingLocation: boolean;
  locationError: string | null;
  userLocation: Location | null;
  selectedLocation: Location | null;
  showMap: boolean;
  maxDistance: number;
  searchType: "teacher" | "course";
  getCurrentLocation: () => void;
  toggleMap: () => void;
  handleMapClick: (location: { lat: number; lng: number }) => void;
  mapCenter: { lat: number; lng: number };
  setMaxDistance: (distance: number) => void;
  teacherLocations?: LocationItem[]
  courseLocations?: LocationItem[]
}

// 🌍 ฟังก์ชันคำนวณระยะทางระหว่าง 2 พิกัด
const getDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
  const toRad = (x: number) => x * Math.PI / 180;
  const R = 6371; // Earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) ** 2;
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
};

export const LocationFilter = ({
  isLoadingLocation,
  locationError,
  userLocation,
  selectedLocation,
  showMap,
  maxDistance,
  searchType,
  getCurrentLocation,
  toggleMap,
  handleMapClick,
  mapCenter,
  setMaxDistance,
  teacherLocations = [],
  courseLocations = [],
}: LocationFilterProps) => {
  const referenceLocation = selectedLocation || userLocation;

  // ✅ ฟิลเตอร์รายการตามระยะทาง
  const filteredTeachers = referenceLocation
    ? teacherLocations.filter(t => getDistance(
        referenceLocation.lat, referenceLocation.lng,
        t.location.lat, t.location.lng
      ) <= maxDistance || maxDistance === 0)
    : teacherLocations;

  const filteredCourses = referenceLocation
    ? courseLocations.filter(c => getDistance(
        referenceLocation.lat, referenceLocation.lng,
        c.location.lat, c.location.lng
      ) <= maxDistance || maxDistance === 0)
    : courseLocations;

  return (
    <div className="mt-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">Distance (km)</label>
      <div className="flex">
        <select
          className="flex-1 border border-gray-300 rounded-l-md p-2 bg-white text-black"
          value={maxDistance}
          onChange={(e) => setMaxDistance(Number(e.target.value))}
        >
          <option value="0">Any Distance</option>
          <option value="5">Within 5 km</option>
          <option value="10">Within 10 km</option>
          <option value="25">Within 25 km</option>
          <option value="50">Within 50 km</option>
        </select>
        <button
          onClick={getCurrentLocation}
          disabled={isLoadingLocation}
          className="flex items-center justify-center px-3 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 disabled:bg-blue-400"
        >
          {isLoadingLocation ? "Locating..." : <><FaCrosshairs className="mr-1" /> My Location</>}
        </button>
      </div>

      <button
        onClick={toggleMap}
        className="mt-2 w-full text-sm text-blue-600 hover:text-blue-800 flex items-center justify-center"
      >
        <FaMapMarkerAlt className="mr-1" />
        {showMap ? "Hide Map" : "Show Map to Select Location"}
      </button>

      {showMap && (
        <div className="mt-4 border rounded-lg overflow-hidden">
          <p>Map should be visible</p>
          <OSMMapSelector 
            center={mapCenter}
            teacherLocations={searchType === "teacher"
              ? filteredTeachers.map(t => ({
                  id: t.id,
                  name: t.name,
                  location: t.location
                }))
              : undefined}
            courseLocations={searchType === "course"
              ? filteredCourses.map(c => ({
                  id: c.id,
                  name: c.name,
                  location: c.location
                }))
              : undefined}
            onLocationSelect={handleMapClick}
          />
          <div className="p-2 bg-gray-50 text-sm">
            {selectedLocation && (
              <p>
                Selected: {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
              </p>
            )}
          </div>
        </div>
      )}

      {locationError && (
        <p className="mt-1 text-sm text-red-600">{locationError}</p>
      )}
      {(userLocation || selectedLocation) && (
        <p className="mt-1 text-sm text-green-600">
          {userLocation === selectedLocation ? "Using your current location" : "Using selected location"}
          {maxDistance > 0 
            ? ` - Showing ${searchType === "teacher" ? "teachers" : "courses"} within ${maxDistance} km` 
            : ""}
        </p>
      )}
    </div>
  );
};
