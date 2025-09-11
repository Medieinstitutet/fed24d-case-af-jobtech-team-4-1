import { useState, useEffect } from 'react';
import type { SearchState, SearchFiltersProps } from '../models/ISearchState';
import { CATEGORY, OMFATTNING, ANSTALLNINGSFORM, RADIUS } from '../models/ISearchState';
import { DigiFormInput, DigiButton, DigiFormSelect, DigiTag, DigiLayoutBlock, DigiTypography } from '@digi/arbetsformedlingen-react';
import { LayoutBlockVariation } from '@digi/arbetsformedlingen';
import './SearchFilters.css';

interface EnhancedSearchFiltersProps extends SearchFiltersProps {
  onSearch: (filters: SearchState) => void;
  showCategoryFilter?: boolean;
  defaultCategory?: string;
}

// Function to extract city from search query
const extractCityFromQuery = (query: string): string => {
  const cities = ['Stockholm', 'Göteborg', 'Malmö', 'Uppsala', 'Linköping', 'Västerås', 'Örebro', 'Helsingborg'];
  const foundCity = cities.find(city => 
    query.toLowerCase().includes(city.toLowerCase())
  );
  return foundCity || 'Stockholm'; // Default to Stockholm
};


export const EnhancedSearchFilters = ({ 
  onFiltersChange, 
  onSearch,
  initialFilters,
  showCategoryFilter = true,
  defaultCategory = 'all'
}: EnhancedSearchFiltersProps) => {
  const [filters, setFilters] = useState<SearchState>({
    query: '',
    category: defaultCategory,
    omfattning: 'all',
    anstallningsform: 'permanent',
    radius: 8,
    location: 'Stockholm',
    ...initialFilters
  });

  useEffect(() => {
    onFiltersChange(filters);
  }, [filters, onFiltersChange]);

  const setF = (field: keyof SearchState, value: string | number) => {
    if (field === 'query') {
      const queryString = value as string;
      const detectedCity = extractCityFromQuery(queryString);
      
      setFilters(prev => ({ 
        ...prev, 
        query: queryString, // Keep full text in input field
        location: detectedCity
      }));
    } else if (field === 'location') {
      setFilters(prev => ({ ...prev, [field]: value as string }));
    } else {
      setFilters(prev => ({ ...prev, [field]: value }));
    }
  };

  const clearFilters = () => {
    const clearedFilters = {
      query: '',
      category: defaultCategory,
      omfattning: 'all',
      anstallningsform: 'permanent',
      radius: 8,
      location: 'Stockholm'
    };
    setFilters(clearedFilters);
  };

  const clearQuery = () => {
    setFilters(prev => ({ 
      ...prev, 
      query: '',
      location: 'Stockholm'
    }));
  };

  const handleSearch = () => {
    onSearch(filters);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };


  return (
    <DigiLayoutBlock afVariation={LayoutBlockVariation.SECONDARY}>
      <DigiTypography>
        <h4 className="search-title">Sök jobb</h4>
      </DigiTypography>
      
      {/* Search row */}
      <div className="search-row">
        <div className="search-input-container">
          <DigiFormInput
            afLabel="Sök"
            value={filters.query}
            onInput={(e: any) => setF('query', e.target.value)}
            onKeyPress={handleKeyPress}
            style={{ fontSize: '14px', padding: '6px' }}
          />
          {filters.query && (
            <button 
              className="clear-search-btn"
              onClick={clearQuery}
              type="button"
            >
              ×
            </button>
          )}
        </div>
        <DigiButton 
          onAfOnClick={handleSearch}
          style={{
            backgroundColor: 'transparent',
            background: 'transparent',
            color: '#57a27e',
            border: 'none',
            borderRadius: '0px',
            fontWeight: '600',
            marginTop: '20px'
          } as React.CSSProperties}
        >
          Sök
        </DigiButton>
      </div>
      

      {/* Filters row */}
      <div className="filters-row">
        {showCategoryFilter && (
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
        )}
        
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
        {showCategoryFilter && filters.category !== defaultCategory && (
          <DigiTag onClick={() => setF('category', defaultCategory)}>
            {filters.category}
          </DigiTag>
        )}
        {filters.omfattning !== 'all' && (
          <DigiTag onClick={() => setF('omfattning', 'all')}>
            {filters.omfattning}
          </DigiTag>
        )}
        {filters.anstallningsform !== 'permanent' && (
          <DigiTag onClick={() => setF('anstallningsform', 'permanent')}>
            {filters.anstallningsform}
          </DigiTag>
        )}
        {filters.radius !== 8 && (
          <DigiTag onClick={() => setF('radius', 8)}>
            {filters.radius} km
          </DigiTag>
        )}

        <DigiButton 
          onAfOnClick={clearFilters}
          style={{
            backgroundColor: 'transparent',
            background: 'transparent',
            color: '#57a27e',
            border: 'none',
            borderRadius: '0px',
            fontWeight: '500',
            fontSize: '14px',
            padding: '10px 20px'
          } as React.CSSProperties}
        >
          Rensa alla filter
        </DigiButton>
      </div>
    </DigiLayoutBlock>
  );
};
