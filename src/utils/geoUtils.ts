/**
 * Geolocation and distance calculation utilities
 * Handles coordinate extraction and distance calculations for radius filtering
 */

import type { IAd } from "../models/IAd";

/**
 * Calculates distance between two coordinates using Haversine formula
 * Returns distance in kilometers
 */
export const calculateDistanceKm = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const toRad = (x: number) => x * Math.PI / 180;
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat/2)**2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon/2)**2;
  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
};

/*
  Extracts coordinates from job ad
 */
export const extractAdCoordinates = (ad: IAd): { lat: number; lon: number } | null => {
  const coords: any = (ad as any).workplace_address?.coordinates;
  return Array.isArray(coords) && coords.length === 2
    ? { lat: coords[1], lon: coords[0] } 
    : null;
};
