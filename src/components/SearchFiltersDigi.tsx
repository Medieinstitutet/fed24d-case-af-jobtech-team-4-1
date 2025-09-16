import React, { useEffect, useState, useContext } from "react";
import {
  DigiFormInput,
  DigiFormSelect,
  DigiButton,
  DigiLayoutBlock,
  DigiLayoutColumns,
  DigiTypography,
} from "@digi/arbetsformedlingen-react";
import { LayoutBlockVariation } from "@digi/arbetsformedlingen";

import { JobContext } from "../contexts/JobContext";
import { JobActionTypes } from "../reducers/JobReducer";

import type { JobSearchFilters } from "../utils/jobFilters";
import { DEFAULT_FILTERS, applyFilters } from "../utils/jobFilters";
import { RADIUS_OPTIONS } from "../utils/constants";
import { getJobAds, type OccupationId } from "../services/jobAdService";
import type { IAd, LocationCoordinates } from "../models/IAd";
import { LocationButton } from "./LocationButton";

import "./SearchFiltersDigi.scss";

type Props = {
  occupation: OccupationId;
  // Optional initial filters
  initial?: Partial<JobSearchFilters>;
  // Debounce (ms) to avoid excessive filtering while typing
  debounceMs?: number;
};

// hook for filter state
const useDebounce = <T,>(value: T, delay = 400) => {
  const [v, setV] = useState(value);
  useEffect(() => {
    const h = setTimeout(() => setV(value), delay);
    return () => clearTimeout(h);
  }, [value, delay]);
  return v;
};

export default function SearchFiltersDigi({ occupation, initial, debounceMs = 400 }: Props) {
  const { dispatch } = useContext(JobContext);
  const [filters, setFilters] = useState<JobSearchFilters>({ ...DEFAULT_FILTERS, ...initial });
  const [baseAds, setBaseAds] = useState<IAd[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<LocationCoordinates | null>(null);

  const debounced = useDebounce(filters, debounceMs);

  // Fetch base ads ONCE per occupation
  useEffect(() => {
    let cancel = false;
    (async () => {
      setLoading(true); setErr(null);
      try {
        const ads = await getJobAds(occupation, debounced.query);
        if (!cancel) setBaseAds(ads);
      } catch (e: any) {
        if (!cancel) setErr(e?.message ?? "Failed to fetch base ads.");
      } finally {
        if (!cancel) setLoading(false);
      }
    })();
    return () => { cancel = true; };
  }, [occupation, debounced.query || ""]);

  // Apply client-side filters and write to context
  useEffect(() => {
    const filtered = applyFilters(baseAds, debounced, userLocation);
    dispatch({
      type: JobActionTypes.SET_JOBS,
      payload: { occupation, jobs: filtered },
    });
  }, [baseAds, debounced, userLocation, occupation, dispatch]);

  // Update filter field
  const updateFilter = <K extends keyof JobSearchFilters>(k: K, v: JobSearchFilters[K]) =>
    setFilters(prev => ({ ...prev, [k]: v }));

  // Update search query - API will handle city detection
  const updateSearch = (query: string) => {
    updateFilter("query", query);
    // API will automatically detect cities in the search query
  };

  // Handle location found from geolocation
  const handleLocationFound = (coordinates: LocationCoordinates) => {
    setUserLocation(coordinates);
  };

  // Use predefined radius options
  const radiusOptions = RADIUS_OPTIONS;


  return (
    <DigiLayoutBlock afVariation={LayoutBlockVariation.SECONDARY} className="search-filters-digi">
      <DigiTypography><h2 className="title">Sök & Filter</h2></DigiTypography>

      {/* Row 1: single search field + Search button + Clear button */}
      <DigiLayoutColumns>
        <div className="row row--search">
          <div className="input-wrap">
            <DigiFormInput
              afLabel="Sök (yrke, stad, ramverk, språk)"
              value={filters.query}
              onInput={(e: React.FormEvent<any>) => updateSearch((e.currentTarget as any).value)}
            />
            {filters.query && (
              <button
                type="button"
                className="clear-btn"
                aria-label="Clear search"
                onClick={() => updateSearch("")}
              >
                ×
              </button>
            )}
          </div>

          <DigiButton className="btn-search" onClick={() => setFilters({ ...DEFAULT_FILTERS })}>
            Sök
          </DigiButton>
        </div>
      </DigiLayoutColumns>

      {/* Row 2: radius + location button + reset button */}
      <DigiLayoutColumns>
        <div className="row row--filters">
                 <DigiFormSelect
                   afLabel="Radie (kräver position)"
                   value={String(filters.radiusKm)}
                   onChange={(e: React.FormEvent<any>) => updateFilter("radiusKm", Number((e.currentTarget as any).value))}
                 >
                   {radiusOptions.map(o => (
                     <option key={o.value} value={o.value}>{o.label}</option>
                   ))}
                 </DigiFormSelect>

          <LocationButton 
            onLocationFound={handleLocationFound}
            disabled={loading}
          />


          <div className="actions">
            <DigiButton onClick={() => setFilters({ ...DEFAULT_FILTERS })}>
              Rensa
            </DigiButton>
          </div>
        </div>
      </DigiLayoutColumns>

      <div className="status" aria-live="polite">
        {loading ? "Söker…" : err ? <span className="error">{err}</span> : null}
      </div>
    </DigiLayoutBlock>
  );
}
