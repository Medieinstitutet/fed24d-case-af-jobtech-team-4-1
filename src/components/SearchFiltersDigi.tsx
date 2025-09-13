import React, { useEffect, useMemo, useState, useContext } from "react";
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
import { getJobAds, type OccupationId } from "../services/jobAdService";
import type { IAd } from "../models/IAd";

import "./SearchFiltersDigi.scss";

type Props = {
  occupation: OccupationId;
  // Optional initial filters
  initial?: Partial<JobSearchFilters>;
  // Debounce (ms) to avoid excessive filtering while typing
  debounceMs?: number;
};

// Simple debounce hook for filter state
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

  const debounced = useDebounce(filters, debounceMs);

  // 1) Fetch base ads ONCE per occupation (reuse your existing service)
  useEffect(() => {
    let cancel = false;
    (async () => {
      setLoading(true); setErr(null);
      try {
        const ads = await getJobAds(occupation);
        if (!cancel) setBaseAds(ads);
      } catch (e: any) {
        if (!cancel) setErr(e?.message ?? "Failed to fetch base ads.");
      } finally {
        if (!cancel) setLoading(false);
      }
    })();
    return () => { cancel = true; };
  }, [occupation]);

  // 2) Apply client-side filters and write to context
  useEffect(() => {
    const filtered = applyFilters(baseAds, debounced);
    dispatch({
      type: JobActionTypes.SET_JOBS,
      payload: { occupation, jobs: filtered },
    });
  }, [baseAds, debounced, occupation, dispatch]);

  // Helper to update a single filter field
  const set = <K extends keyof JobSearchFilters>(k: K, v: JobSearchFilters[K]) =>
    setFilters(prev => ({ ...prev, [k]: v }));

  // Extract city from query and update location automatically
  const handleQueryChange = (query: string) => {
    set("query", query);
    
    // Extract city from query
    const cities = [
      "stockholm", "göteborg", "goteborg", "malmö", "malmo",
      "uppsala", "västerås", "vasteras", "örebro", "orebro",
      "linköping", "linkoping", "helsingborg", "lund",
      "norrköping", "norrkoping", "umeå", "umea", "luleå", "lulea",
      "växjö", "vaxjo", "karlstad", "jönköping", "jonkoping", "borås", "boras",
      "eskilstuna", "sundsvall", "gävle", "gavle", "huddinge", "nacka", "solna",
      "södertälje", "sodertalje", "hässleholm", "hassleholm", "östersund", "ostersund",
      "trollhättan", "trollhattan", "kristianstad", "karlskrona", "skövde", "skovde",
      "uddevalla", "landskrona", "motala", "piteå", "pitea", "vänersborg", "vanersborg",
      "borlänge", "borlange", "säffle", "saffle", "kungsbacka", "kristinehamn",
      "karlshamn", "falkenberg", "sandviken", "varberg", "trelleborg", "lindesberg",
      "kramfors", "haparanda"
    ];
    
    const normalizedQuery = query.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const foundCity = cities.find(city => normalizedQuery.includes(city));
    
    if (foundCity) {
      set("location", foundCity);
    } else {
      set("location", "");
    }
  };

  // Precompute radius options
  const radiusOptions = useMemo(
    () => [0, 10, 25, 50, 100].map(v => ({ value: v, label: v === 0 ? "Ingen" : `${v} km` })),
    []
  );

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
              onInput={(e: React.FormEvent<any>) => handleQueryChange((e.currentTarget as any).value)}
            />
            {filters.query && (
              <button
                type="button"
                className="clear-btn"
                aria-label="Clear search"
                onClick={() => handleQueryChange("")}
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

      {/* Row 2: radius + contract type + reset button */}
      <DigiLayoutColumns>
        <div className="row row--filters">
          <DigiFormSelect
            afLabel="Radie"
            value={String(filters.radiusKm)}
            onChange={(e: React.FormEvent<any>) => set("radiusKm", Number((e.currentTarget as any).value))}
          >
            {radiusOptions.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </DigiFormSelect>

          <DigiFormSelect
            afLabel="Anställningsform"
            value={filters.contractType}
            onChange={(e: React.FormEvent<any>) =>
              set("contractType", (e.currentTarget as any).value as JobSearchFilters["contractType"])
            }
          >
            <option value="all">Alla</option>
            <option value="permanent">Tillsvidare</option>
            <option value="temporary">Visstid</option>
          </DigiFormSelect>

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
