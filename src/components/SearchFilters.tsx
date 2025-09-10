import { useState, useEffect } from 'react';
import type { SearchState, SearchFiltersProps } from '../models/ISearchState';
import { CATEGORY, OMFATTNING, ANSTALLNINGSFORM, RADIUS } from '../models/ISearchState';
import { DigiFormInput, DigiButton, DigiFormSelect, DigiTag, DigiLayoutBlock, DigiTypography } from '@digi/arbetsformedlingen-react';
import { LayoutBlockVariation } from '@digi/arbetsformedlingen';
import './SearchFilters.css';
export const SearchFilters = ({ onFiltersChange, initialFilters }: SearchFiltersProps) => {
  const [filters, setFilters] = useState<SearchState>({
    query: '',
    category: 'all',
    omfattning: 'all',
    anstallningsform: 'permanent',
    radius: 8,
    ...initialFilters
  });

  useEffect(() => {
    onFiltersChange(filters);
  }, [filters, onFiltersChange]);

  const setF = (field: keyof SearchState, value: string | number) =>
    setFilters(prev => ({ ...prev, [field]: value }));

  const clearFilters = () => {
    setFilters({
      query: '',
      category: 'all',
      omfattning: 'all',
      anstallningsform: 'permanent',
      radius: 8
    });
  };

  return (
    <DigiLayoutBlock afVariation={LayoutBlockVariation.SECONDARY}>
      <DigiTypography>
        <h4 className="search-title">Search & Filters</h4>
      </DigiTypography>
      
      {/* Compact search row */}
      <div className="search-row">
        <DigiFormInput
          afLabel="Sök"
          value={filters.query}
          onInput={(e: any) => setF('query', e.target.value)}
          style={{ fontSize: '14px', padding: '6px' }}
        />
        {filters.query && (
          <DigiButton onAfOnClick={() => setF('query', '')}>
            Rensa
          </DigiButton>
        )}
        <DigiButton onAfOnClick={(e) => { e.preventDefault(); }}>
          Sök
        </DigiButton>
      </div>

      {/* Compact filters in row */}
      <div className="filters-row">
        <DigiFormSelect
          afLabel="Kategori"
          value={filters.category}
          onInput={(e: any) => setF('category', e.target.value)}
          style={{ fontSize: '14px', padding: '6px' }}
        >
          {Object.entries(CATEGORY).map(([key, value]) => (
            <option key={key} value={value}>{value}</option>
          ))}
        </DigiFormSelect>
        
        <DigiFormSelect
          afLabel="Omfattning"
          value={filters.omfattning}
          onInput={(e: any) => setF('omfattning', e.target.value)}
          style={{ fontSize: '14px', padding: '6px' }}
        >
          {Object.entries(OMFATTNING).map(([key, value]) => (
            <option key={key} value={value}>{value}</option>
          ))}
        </DigiFormSelect>
        
        <DigiFormSelect
          afLabel="Anställningsform"
          value={filters.anstallningsform}
          onInput={(e: any) => setF('anstallningsform', e.target.value)}
          style={{ fontSize: '14px', padding: '6px' }}
        >
          {Object.entries(ANSTALLNINGSFORM).map(([key, value]) => (
            <option key={key} value={value}>{value}</option>
          ))}
        </DigiFormSelect>
        
        <DigiFormSelect
          afLabel="Radie (km)"
          value={String(filters.radius)}
          onInput={(e: any) => setF('radius', Number(e.target.value))}
          style={{ fontSize: '14px', padding: '6px' }}
        >
          {Object.entries(RADIUS).map(([key, value]) => (
            <option key={key} value={value}>{value} km</option>
          ))}
        </DigiFormSelect>
      </div>

      {/* Active filter chips */}
      <div className="filter-chips">
        {filters.category !== 'all' && (
          <DigiTag onClick={() => setF('category', 'all')}>{filters.category}</DigiTag>
        )}
        {filters.omfattning !== 'all' && (
          <DigiTag onClick={() => setF('omfattning', 'all')}>{filters.omfattning}</DigiTag>
        )}
        {filters.anstallningsform !== 'permanent' && (
          <DigiTag onClick={() => setF('anstallningsform', 'permanent')}>
            {filters.anstallningsform}
          </DigiTag>
        )}
        {filters.radius !== 8 && (
          <DigiTag onClick={() => setF('radius', 8)}>{filters.radius} km</DigiTag>
        )}

        <DigiButton onAfOnClick={clearFilters}>
          Rensa filter
        </DigiButton>
      </div>
    </DigiLayoutBlock>
  );
};