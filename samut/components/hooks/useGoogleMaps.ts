"use client"

import { useState, useEffect } from 'react';

export const useGoogleMaps = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
      setLoadError("Google Maps API key is not configured");
      return;
    }

    const checkGoogle = () => {
      if (window.google && window.google.maps) {
        setIsLoaded(true);
        return true;
      }
      return false;
    };

    // Check if already loaded
    if (checkGoogle()) return;

    // Check if script is already being loaded
    const existingScript = document.querySelector(
      'script[src*="maps.googleapis.com"]'
    );

    if (existingScript) {
      const interval = setInterval(() => {
        if (checkGoogle()) {
          clearInterval(interval);
        }
      }, 100);
      return;
    }

    // Load the script
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      if (!checkGoogle()) {
        setLoadError("Google Maps API loaded but not properly initialized");
      }
    };
    
    script.onerror = () => {
      setLoadError("Failed to load Google Maps API");
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup if needed
    };
  }, []);

  return { isLoaded, loadError };
};