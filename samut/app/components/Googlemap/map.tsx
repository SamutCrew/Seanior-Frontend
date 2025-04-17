"use client"

import { GoogleMap, MarkerF } from '@react-google-maps/api';
import { useEffect, useState } from 'react';
import { useGoogleMaps } from '../hooks/useGoogleMaps';

interface MapProps {
  center: {
    lat: number;
    lng: number;
  };
  zoom: number;
  onClick?: (e: google.maps.MapMouseEvent) => void;
  markers?: Array<{
    lat: number;
    lng: number;
    address?: string;
  }>;
}

const Map = ({ center, zoom, onClick, markers = [] }: MapProps) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const { isLoaded, loadError } = useGoogleMaps();

  useEffect(() => {
    if (map && center) {
      map.panTo(center);
    }
  }, [center, map]);

  if (loadError) {
    return (
      <div className="h-full w-full bg-gray-200 flex items-center justify-center">
        Error: {loadError}
        <br />
        {loadError.includes("API key") && (
          <span>Please check your Google Maps API key configuration</span>
        )}
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="h-full w-full bg-gray-200 flex items-center justify-center">
        Loading map...
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerClassName="h-full w-full"
      center={center}
      zoom={zoom}
      onClick={onClick}
      onLoad={(map) => setMap(map)}
      onUnmount={() => setMap(null)}
    >
      {markers.map((marker, index) => (
        <MarkerF
          key={index}
          position={{ lat: marker.lat, lng: marker.lng }}
          title={marker.address || "Selected location"}
        />
      ))}
    </GoogleMap>
  );
};

export default Map;