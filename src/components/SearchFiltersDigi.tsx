import React, { useEffect, useMemo, useState, useContext, useCallback } from "react";
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
  // Optional initial filter values.
  initial?: Partial<JobSearchFilters>;
  debounceMs?: number;
};


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

  // Filters used to compute the current result set.
  const [filters, setFilters] = useState<JobSearchFilters>({ ...DEFAULT_FILTERS, ...initial });

  // Input content (committed to filters.query on Enter/"Sök").
  const [keyword, setKeyword] = useState<string>(filters.query ?? "");
  const debouncedKeyword = useDebounce(keyword, debounceMs);

  // Base ads fetched once for a given occupation; filtering is client-side.
  const [baseAds, setBaseAds] = useState<IAd[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // Fetch base ads ONCE per occupation using existing service.
  useEffect(() => {
    let cancel = false;
    (async () => {
      setLoading(true);
      setErr(null);
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

  //city inference from query.
  const inferCity = (q: string): string => {
    const cities = [
      "stockholm", "göteborg", "goteborg", "malmö", "malmo",
      "uppsala", "västerås", "vasteras", "örebro", "orebro",
      "linköping", "linkoping", "helsingborg", "lund",
      "norrköping", "norrkoping",
    ];
    const n = q.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return cities.find((c) => n.includes(c)) || "";
  };

  // Keep filters in sync with debounced keyword so typing updates results smoothly.
  useEffect(() => {
    const q = debouncedKeyword.trim();
    setFilters((prev) => ({
      ...prev,
      query: q,
      location: inferCity(q),
    }));
  }, [debouncedKeyword]);

  // Recompute results and write them into JobContext (read by AdsPresentation).
  useEffect(() => {
    const filtered = applyFilters(baseAds, filters);
    dispatch({
      type: JobActionTypes.SET_JOBS,
      payload: { occupation, jobs: filtered },
    });
  }, [baseAds, filters, occupation, dispatch]);

  // Convenience setter for a single filter field.
  const set = <K extends keyof JobSearchFilters>(k: K, v: JobSearchFilters[K]) =>
    setFilters((prev) => ({ ...prev, [k]: v }));

  // Radius options (0 disables radius).
  const radiusOptions = useMemo(
    () => [0, 10, 25, 50, 100].map((v) => ({ value: v, label: v === 0 ? "Ingen" : `${v} km` })),
    []
  );

  // Explicit "Search" action
  const triggerSearch = useCallback(() => {
    set("query", keyword.trim());
  }, [keyword]);

  // Allow Enter to trigger search.
  const handleEnter = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      triggerSearch();
    }
  };

  // Clear only the search query (and re-run filtering).
  const clearInput = () => {
    setKeyword("");
    set("query", "");
  };

  // Reset all filters to defaults.
  const resetFilters = () => {
    setKeyword("");
    setFilters({ ...DEFAULT_FILTERS });
  };

  return (
    <DigiLayoutBlock
      afVariation={LayoutBlockVariation.SECONDARY}
      className="search-filters-digi"
    >
      <DigiTypography>
        <h2 className="title">Sök & Filter</h2>
      </DigiTypography>

      {/* Row 1: single search field + Search button.*/}
      <DigiLayoutColumns>
        <div className="row row--search">
          <div className="input-wrap">
            <DigiFormInput
              afLabel="Sök (yrke, stad, ramverk, språk)"
              value={keyword}
              // Digi web components; read value from currentTarget.
              onInput={(e: React.FormEvent<any>) => setKeyword((e.currentTarget as any).value)}
              onKeyDown={handleEnter as any}
            />
            {keyword && (
              <button
                type="button"
                className="clear-btn"
                aria-label="Clear search"
                onClick={clearInput}
              >
                ×
              </button>
            )}
          </div>

          <DigiButton className="btn-search" onClick={triggerSearch}>
            Sök
          </DigiButton>
        </div>
      </DigiLayoutColumns>

      {/* Row 2: radius + contract type + reset button. */}
      <DigiLayoutColumns>
        <div className="row row--filters">
          <DigiFormSelect
            afLabel="Radie"
            value={String(filters.radiusKm)}
            onChange={(e: React.FormEvent<any>) =>
              set("radiusKm", Number((e.currentTarget as any).value))
            }
          >
            {radiusOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
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
            <DigiButton onClick={resetFilters}>Rensa filter</DigiButton>
          </div>
        </div>
      </DigiLayoutColumns>

      <div className="status" aria-live="polite">
        {loading ? "Söker…" : err ? <span className="error">{err}</span> : null}
      </div>
    </DigiLayoutBlock>
  );
}
