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
import { DEFAULT_FILTERS, applyClientSideFilters } from "../utils/jobFilters";
import { RADIUS_OPTIONS } from "../utils/constants";
import { getJobAds, type OccupationId } from "../services/jobAdService";
import type { IAd } from "../models/IAd";
import type { LocationCoordinates } from "../models/ILocationCoordinates";
import { LocationButton } from "./LocationButton";
import "./SearchFiltersDigi.scss";

type Props = {
  occupation: OccupationId;
  initial?: Partial<JobSearchFilters>;
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
  const [locationButtonDisabled, setLocationButtonDisabled] = useState(false);

  const debounced = useDebounce(filters, debounceMs);

  // Fetch filtered ads from API including radius filtering
  useEffect(() => {
    let cancel = false;
    (async () => {
      setLoading(true); setErr(null);
      try {
        // Pass filters + userLocation to API for radius filtering
        const ads = await getJobAds(occupation, debounced, userLocation);
        if (!cancel) {setBaseAds(ads.hits);
          dispatch({
    type: JobActionTypes.SET_PAGINATION,
    payload: {
      occupation,
      pagination: {
        currentPage: Math.floor(ads.offset / 25) + 1,
        totalPages: Math.ceil(ads.totalCount / 25),
        totalCount: ads.totalCount,
      },
    },
  });
}
      } catch (e: any) {
        if (!cancel) setErr(e?.message ?? "Failed to fetch base ads.");
      } finally {
        if (!cancel) setLoading(false);
      }
    })();
    return () => { cancel = true; };
  }, [occupation, debounced.query || "", debounced.radiusKm, userLocation]);

  // Apply client-side radius filtering as fallback
  useEffect(() => {
    let filteredAds = baseAds;
    
    if (debounced.radiusKm > 0 && userLocation) {
      filteredAds = applyClientSideFilters(baseAds, debounced, userLocation);
    }
    
    dispatch({
      type: JobActionTypes.SET_JOBS,
      payload: { occupation, jobs: filteredAds },
    });
  }, [baseAds, debounced, userLocation, occupation, dispatch]);

  // Update filter field
  const updateFilter = <K extends keyof JobSearchFilters>(k: K, v: JobSearchFilters[K]) =>
    setFilters(prev => ({ ...prev, [k]: v }));

  const updateSearch = (query: string) => {
    updateFilter("query", query);
    
  };

  // Handle location found from geolocation
  const handleLocationFound = (coordinates: LocationCoordinates) => {
    setUserLocation(coordinates);
    setLocationButtonDisabled(false);
  };

  // Use predefined radius options
  const radiusOptions = RADIUS_OPTIONS;


  return (
    <DigiLayoutBlock afVariation={LayoutBlockVariation.SECONDARY} className="search-filters-digi">
      <DigiTypography><h2 className="title">Sök & Filter</h2></DigiTypography>

      {/* Row 1: search field with auto-search */}
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
            disabled={loading || locationButtonDisabled}
          />
          
          <div className="actions">
            <DigiButton onClick={() => {
              // Clear all filters and location
              setFilters({ ...DEFAULT_FILTERS });
              setUserLocation(null);
              setLocationButtonDisabled(true); 
              setLoading(true); 
              
              // Automatically trigger location search after clearing
              setTimeout(() => {
                if (navigator.geolocation) {
                  navigator.geolocation.getCurrentPosition(
                    (position) => {
                      const coordinates = {
                        lat: position.coords.latitude,
                        lon: position.coords.longitude
                      };
                      setUserLocation(coordinates);
                      setLocationButtonDisabled(false);
                      setLoading(false);
                    },
                    () => {
                      setLocationButtonDisabled(false);
                      setLoading(false);
                    },
                    {
                      enableHighAccuracy: true,
                      timeout: 10000,
                      maximumAge: 300000
                    }
                  );
                } else {
                  setLocationButtonDisabled(false); 
                  setLoading(false); 
                }
              }, 100);
            }}>
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
