/**
 * Application constants
 * Centralized configuration values to avoid duplication
 * 
 * This file contains:
 * - RADIUS_OPTIONS: Available radius options for location-based search (0, 25, 50, 100 km)
 * - DEFAULT_SEARCH_FILTERS: Default values for search filters (empty query, no radius, no employment type)
 */

/**
 * Radius options for location-based job search
 * Values in kilometers
 */
export const RADIUS_OPTIONS = [
  { value: 0, label: "Ingen" },
  { value: 25, label: "25 km" },
  { value: 50, label: "50 km" },
  { value: 100, label: "100 km" },
] as const;

/**
 * Default search filters
 */
export const DEFAULT_SEARCH_FILTERS = {
  query: "",
  radiusKm: 0,
  employmentType: "",
} as const;

