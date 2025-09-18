export const RADIUS_OPTIONS = [
  { value: 0, label: "Ingen" },
  { value: 25, label: "25 km" },
  { value: 50, label: "50 km" },
  { value: 100, label: "100 km" },
] as const;

export const DEFAULT_SEARCH_FILTERS = {
  query: "",
  radiusKm: 0,
  employmentType: "",
} as const;
