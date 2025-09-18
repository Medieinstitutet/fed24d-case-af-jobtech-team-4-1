import React, { useState } from "react";
import { DigiButton } from "@digi/arbetsformedlingen-react";
import type { ILocationCoordinates } from "../models/ILocationCoordinates";

interface LocationButtonProps {
  onLocationFound: (coordinates: ILocationCoordinates) => void;
  disabled?: boolean;
}

export const LocationButton: React.FC<LocationButtonProps> = ({ onLocationFound, disabled = false }) => {
  const [loading, setLoading] = useState(false);

  const getCurrentLocation = () => {
    if (disabled || loading) {
      return;
    }

    if (!navigator.geolocation) {
      alert("Geolocation stöds inte av din webbläsare");
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      position => {
        const coordinates = {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        };

        onLocationFound(coordinates);
        setLoading(false);
      },
      error => {
        console.log("Geolocation error:", error);
        let errorMessage = "Kunde inte hämta din position";

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Tillstånd för geolocation nekades";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Position information är inte tillgänglig";
            break;
          case error.TIMEOUT:
            errorMessage = "Geolocation timeout";
            break;
        }

        alert(errorMessage);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  };

  return (
    <DigiButton
      onClick={disabled || loading ? undefined : getCurrentLocation}
      className="location-button"
      style={{
        opacity: disabled || loading ? 0.6 : 1,
        cursor: disabled || loading ? "not-allowed" : "pointer",
      }}
    >
      {loading ? "Hämtar position..." : "Sök"}
    </DigiButton>
  );
};
