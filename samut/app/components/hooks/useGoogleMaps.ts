"use client"

import { useState, useEffect } from 'react';

export const useGoogleMaps = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    // Check if Google Maps API is already loaded
    if (window.google && window.google.maps) {
      setIsLoaded(true);
      return;
    }

    // Check if we're already loading the script
    if (document.querySelector(`script[src*="maps.googleapis.com"]`)) {
      // Script is already being loaded, just wait for it
      const checkLoaded = () => {
        if (window.google && window.google.maps) {
          setIsLoaded(true);
        } else {
          setTimeout(checkLoaded, 100);
        }
      };
      checkLoaded();
      return;
    }

    // Load Google Maps API
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.google && window.google.maps) {
        setIsLoaded(true);
      } else {
        setLoadError("Google Maps API failed to load");
      }
    };
    script.onerror = () => {
      setLoadError("Failed to load Google Maps API");
    };

    document.head.appendChild(script);

    return () => {
      // We don't remove the script to prevent multiple loads
    };
  }, []);

  return { isLoaded, loadError };
};