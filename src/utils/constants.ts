/**
 * Application constants
 * Centralized configuration values to avoid duplication
 */

/**
 * Radius options for location-based job search
 * Values in kilometers
 */
export const RADIUS_OPTIONS = [
  { value: 0, label: "Ingen" },
  { value: 10, label: "10 km" },
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
} as const;
