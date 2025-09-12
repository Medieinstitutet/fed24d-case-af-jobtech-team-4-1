
import type { IAd } from "../models/IAd";

export type ContractType = "all" | "permanent" | "temporary";

export interface JobSearchFilters {
  // Free-text: profession, city, framework, language (tolerates typos)
  query: string;
  // Optional city name for location & radius
  location?: string;
  // 0 disables radius filtering
  radiusKm: number;
  // Contract flavor (best-effort keyword detection)
  contractType: ContractType;
}

export const DEFAULT_FILTERS: JobSearchFilters = {
  query: "",
  location: "",
  radiusKm: 0,
  contractType: "all",
};

// Minimal city-to-coordinates map (extend as needed)
const CITY_COORDS: Record<string, { lat: number; lon: number }> = {
  stockholm: { lat: 59.3293, lon: 18.0686 },
  göteborg: { lat: 57.7089, lon: 11.9746 },
  goteborg: { lat: 57.7089, lon: 11.9746 },
  malmö: { lat: 55.604981, lon: 13.003822 },
  malmo: { lat: 55.604981, lon: 13.003822 },
  uppsala: { lat: 59.8586, lon: 17.6389 },
  västerås: { lat: 59.6099, lon: 16.5448 },
  vasteras: { lat: 59.6099, lon: 16.5448 },
  örebro: { lat: 59.2753, lon: 15.2134 },
  orebro: { lat: 59.2753, lon: 15.2134 },
  linköping: { lat: 58.4109, lon: 15.6216 },
  linkoping: { lat: 58.4109, lon: 15.6216 },
  helsingborg: { lat: 56.0465, lon: 12.6945 },
  lund: { lat: 55.7047, lon: 13.191 },
  norrköping: { lat: 58.5877, lon: 16.1924 },
  norrkoping: { lat: 58.5877, lon: 16.1924 },
};

// ---------- helpers ----------
const normalize = (s: string) =>
  s.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}\s#\.\-]/gu, " ") // Keep #, ., and - for programming languages
    .replace(/\s+/g, " ")
    .trim();

const levenshtein = (a: string, b: string) => {
  const m = a.length, n = b.length;
  if (!m) return n;
  if (!n) return m;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return dp[m][n];
};

const fuzzyIncludes = (hayRaw: string, needleRaw: string): boolean => {
  const hay = normalize(hayRaw);
  const needle = normalize(needleRaw);
  if (!needle) return true;
  if (hay.includes(needle)) return true;
  const words = hay.split(" ");
  const tokens = needle.split(" ");
  for (const tok of tokens) {
    const maxDist = tok.length <= 4 ? 1 : tok.length <= 7 ? 2 : 3;
    let ok = false;
    for (const w of words) {
      if (w.includes(tok) || levenshtein(w, tok) <= maxDist) { ok = true; break; }
    }
    if (!ok) return false;
  }
  return true;
};

const any = (arr: string[], q: string) => arr.some(s => fuzzyIncludes(s, q));


const contractTypeOf = (ad: IAd): ContractType => {
  const blob = `${ad.headline} ${ad.description?.text ?? ""}`.toLowerCase();
  if (/\btillsvidare|permanent|fast anställning\b/.test(blob)) return "permanent";
  if (/\bvisstid|vikariat|temporary|contract|projekt|timanställning\b/.test(blob)) return "temporary";
  return "all";
};

// Haversine (km)
const haversineKm = (lat1:number, lon1:number, lat2:number, lon2:number) => {
  const toRad = (x:number)=>x*Math.PI/180, R=6371;
  const dLat = toRad(lat2-lat1), dLon = toRad(lon2-lon1);
  const a = Math.sin(dLat/2)**2 + Math.cos(toRad(lat1))*Math.cos(toRad(lat2))*Math.sin(dLon/2)**2;
  return 2*R*Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
};

const coordsFromAd = (ad: IAd): { lat:number; lon:number } | null => {
  const coords: any = (ad as any).workplace_address?.coordinates;
  return Array.isArray(coords) && coords.length === 2
    ? { lat: coords[1], lon: coords[0] } // JobTech is [lon, lat]
    : null;
};

// Extract city from search query
const extractCityFromQuery = (query: string): string => {
  const cities = Object.keys(CITY_COORDS);
  const normalizedQuery = normalize(query);
  
  for (const city of cities) {
    if (normalizedQuery.includes(city)) {
      return city;
    }
  }
  return "";
};

// ---------- apply filters & score ----------
export function applyFilters(ads: IAd[], f: JobSearchFilters): IAd[] {
  const q = f.query.trim();
  console.log('🔍 applyFilters called with:', { 
    query: q, 
    totalAds: ads.length,
    normalizedQuery: normalize(q)
  });
  
  // Extract city from query if no explicit location is provided
  const extractedCity = extractCityFromQuery(q);
  const loc = normalize(f.location ?? extractedCity);
  const hasLoc = !!loc;
  const center = hasLoc && CITY_COORDS[loc] ? CITY_COORDS[loc] : null;

  const filtered = ads.filter(ad => {
    if (f.contractType !== "all" && contractTypeOf(ad) !== f.contractType) return false;

    // Client-side radius
    if (f.radiusKm > 0 && hasLoc) {
      const c = coordsFromAd(ad);
      if (center && c) {
        if (haversineKm(center.lat, center.lon, c.lat, c.lon) > f.radiusKm) return false;
      } else {
        const muni = ad.workplace_address?.municipality ?? "";
        if (!fuzzyIncludes(muni, loc)) return false;
      }
    } else if (hasLoc) {
      const muni = ad.workplace_address?.municipality ?? "";
      const region = ad.workplace_address?.region ?? "";
      if (!(fuzzyIncludes(muni, loc) || fuzzyIncludes(region, loc))) return false;
    }

    if (q) {
      const fields = [
        ad.headline,
        ad.occupation?.label ?? "",
        ad.employer?.name ?? "",
        ad.workplace_address?.municipality ?? "",
        ad.workplace_address?.region ?? "",
        ad.description?.text ?? "",
      ];
      
      // Enhanced search for programming languages and frameworks
      const normalizedQuery = normalize(q);
      
      // Special handling for C# - check both original and normalized versions
      let matches = any(fields, q);
      
      // Special handling for C# - check both original and normalized versions
      if (q.toLowerCase().includes('c#') || q.toLowerCase().includes('csharp')) {
        const csharpQuery = q.toLowerCase().replace(/c#/g, 'csharp').replace(/csharp/g, 'c sharp');
        console.log('🔍 C# special handling:', { original: q, csharpQuery });
        if (any(fields, csharpQuery)) matches = true;
      }
      
      // Special handling for .NET - check for net, dotnet, asp.net
      if (q.toLowerCase().includes('net') || q.toLowerCase().includes('dotnet')) {
        const netQuery = q.toLowerCase().replace(/net/g, 'dotnet').replace(/dotnet/g, 'asp.net');
        console.log('🔍 .NET special handling:', { original: q, netQuery });
        if (any(fields, netQuery)) matches = true;
      }
      
      // Special handling for Swift - check for swift, swiftui, ios
      if (q.toLowerCase().includes('swift') || q.toLowerCase().includes('syit')) {
        const swiftQuery = q.toLowerCase().replace(/syit/g, 'swift').replace(/swift/g, 'swiftui');
        console.log('🔍 Swift special handling:', { original: q, swiftQuery });
        if (any(fields, swiftQuery)) matches = true;
      }
      
      // Additional search for programming languages and frameworks
      if (!matches) {
        const programmingTerms = [
          'javascript', 'js', 'typescript', 'ts', 'python', 'java', 'c#', 'csharp', 'c sharp',
          'php', 'ruby', 'go', 'rust', 'swift', 'kotlin', 'scala', 'r',
          'react', 'vue', 'angular', 'node', 'express', 'django', 'flask',
          'spring', 'laravel', 'symfony', 'rails', 'asp.net', 'dotnet', 'asp net', 'net', 'nf',
          'html', 'css', 'sass', 'scss', 'less', 'bootstrap', 'tailwind',
          'mongodb', 'mysql', 'postgresql', 'redis', 'elasticsearch',
          'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'firebase',
          'git', 'github', 'gitlab', 'jenkins', 'ci/cd', 'devops',
          'frontend', 'backend', 'fullstack', 'full-stack', 'full stack',
          'utvecklare', 'developer', 'programmerare', 'programmer',
          'webbutvecklare', 'web developer', 'apputvecklare', 'app developer',
          'swift', 'swiftui', 'ios', 'android', 'kotlin', 'flutter', 'dart'
        ];
        
        const queryWords = normalizedQuery.split(" ").filter(w => w.length > 1);
        matches = queryWords.some(word => 
          programmingTerms.some(term => 
            term.includes(word) || word.includes(term) || 
            levenshtein(term, word) <= 2
          )
        );
        
        // Also check if any field contains the full query
        if (!matches) {
          matches = fields.some(field => 
            normalize(field).includes(normalizedQuery) ||
            normalizedQuery.split(" ").some(word => 
              normalize(field).includes(word) && word.length > 2
            )
          );
        }
      }
      
      if (!matches) return false;
    }

    return true;
  });

  // Enhanced relevance score
  const normQ = normalize(q);
  const score = (ad: IAd) => {
    let s = 0;
    const headline = normalize(ad.headline ?? "");
    const occupation = normalize(ad.occupation?.label ?? "");
    const description = normalize(ad.description?.text ?? "");
    
    // Exact matches get highest score
    if (normQ && headline.includes(normQ)) s += 10;
    if (normQ && occupation.includes(normQ)) s += 8;
    if (normQ && description.includes(normQ)) s += 6;
    
    // Partial matches
    if (normQ && headline.includes(normQ.split(" ")[0])) s += 5;
    if (normQ && occupation.includes(normQ.split(" ")[0])) s += 4;
    
    // Programming language matches in description
    if (normQ) {
      const programmingTerms = [
        'javascript', 'js', 'typescript', 'ts', 'python', 'java', 'c#', 'csharp', 'c sharp',
        'php', 'ruby', 'go', 'rust', 'swift', 'kotlin', 'scala', 'r',
        'react', 'vue', 'angular', 'node', 'express', 'django', 'flask',
        'spring', 'laravel', 'symfony', 'rails', 'asp.net', 'dotnet', 'asp net', 'net', 'nf',
        'swift', 'swiftui', 'ios', 'android', 'kotlin', 'flutter', 'dart'
      ];
      
      const queryWords = normQ.split(" ");
      queryWords.forEach(word => {
        programmingTerms.forEach(term => {
          if (term.includes(word) || word.includes(term)) {
            if (description.includes(term)) s += 3;
            if (headline.includes(term)) s += 4;
          }
        });
      });
    }
    
    // Location bonus
    if (hasLoc && normalize(ad.workplace_address?.municipality ?? "").includes(loc)) s += 3;
    
    
    return -s; 
  };

  return filtered.sort((a,b)=> score(a)-score(b));
}
