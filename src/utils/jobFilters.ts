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
    // More lenient distance calculation based on word length
    let maxDist = 1;
    if (tok.length <= 3) maxDist = 1;
    else if (tok.length <= 5) maxDist = 2;
    else if (tok.length <= 8) maxDist = 3;
    else maxDist = Math.floor(tok.length / 3); // For longer words, allow more errors
    
    let ok = false;
    for (const w of words) {
      // Check for substring match first (most common case)
      if (w.includes(tok) || tok.includes(w)) {
        ok = true;
        break;
      }
      // Check for fuzzy match with Levenshtein distance
      if (levenshtein(w, tok) <= maxDist) {
        ok = true;
        break;
      }
      // Check for partial character matches (for typos like missing letters)
      if (tok.length > 3 && w.length > 3) {
        const commonChars = [...tok].filter(char => w.includes(char)).length;
        const similarity = commonChars / Math.max(tok.length, w.length);
        if (similarity >= 0.7) { // 70% character similarity
          ok = true;
          break;
        }
      }
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

// ---------- main: apply filters & score ----------
export function applyFilters(ads: IAd[], f: JobSearchFilters): IAd[] {
  const q = f.query.trim();
  const loc = normalize(f.location ?? "");
  const hasLoc = !!loc;
  const center = hasLoc && CITY_COORDS[loc] ? CITY_COORDS[loc] : null;

  const filtered = ads.filter(ad => {
    if (f.contractType !== "all" && contractTypeOf(ad) !== f.contractType) return false;

    // Client-side radius (API has no radius)
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
      
      // Enhanced search for programming languages, frameworks, professions and cities
      const normalizedQuery = normalize(q);
      
      // First try exact fuzzy match across all fields
      let matches = any(fields, q);
      
      // If no exact match, try flexible word-by-word matching
      if (!matches) {
        const queryWords = normalizedQuery.split(" ").filter(w => w.length > 1);
        
        // Check if at least one query word appears in any field (more flexible)
        const anyWordMatches = queryWords.some(word => 
          fields.some(field => fuzzyIncludes(field, word))
        );
        
        if (anyWordMatches) {
          matches = true;
        }
      }
      
      // Special handling for common typos and variations
      const commonTypos: Record<string, string[]> = {
        'react': ['reakt', 'reac', 'reactjs', 'react.js'],
        'javascript': ['javascrip', 'javasript', 'js', 'java script'],
        'typescript': ['typescrip', 'typescri', 'ts', 'type script'],
        'python': ['pytho', 'pythn', 'py'],
        'angular': ['angula', 'angulr', 'ng'],
        'vue': ['vuejs', 'vue.js'],
        'node': ['nodejs', 'node.js'],
        'frontend': ['front-end', 'front end', 'frontend'],
        'backend': ['back-end', 'back end', 'backend'],
        'fullstack': ['full-stack', 'full stack', 'fullstack'],
        'developer': ['develper', 'developr', 'dev'],
        'programmer': ['programer', 'programmr', 'programing'],
        'stockholm': ['stockhol', 'stockholms'],
        'göteborg': ['goteborg', 'götebor', 'gothenburg'],
        'malmö': ['malmo', 'malm', 'malmö'],
        'uppsala': ['uppsal', 'upsala'],
        'västerås': ['vasteras', 'västerå', 'vasteras'],
        'örebro': ['orebro', 'öreb', 'orebro'],
        'linköping': ['linkoping', 'linköp', 'linkoping'],
        'helsingborg': ['helsingbor', 'helsingburg'],
        'norrköping': ['norrkoping', 'norrköp', 'norrkoping']
      };
      
      // Check for common typos
      for (const [correct, typos] of Object.entries(commonTypos)) {
        if (typos.some(typo => q.toLowerCase().includes(typo))) {
          if (any(fields, correct)) {
            matches = true;
            break;
          }
        }
      }
      
      // Special handling for C# - check both original and normalized versions
      if (q.toLowerCase().includes('c#') || q.toLowerCase().includes('csharp') || q.toLowerCase().includes('c sharp')) {
        const csharpQuery = q.toLowerCase().replace(/c#/g, 'csharp').replace(/csharp/g, 'c sharp');
        if (any(fields, csharpQuery)) matches = true;
      }
      
      // Special handling for .NET - check for net, dotnet, asp.net
      if (q.toLowerCase().includes('net') || q.toLowerCase().includes('dotnet') || q.toLowerCase().includes('asp net')) {
        const netQuery = q.toLowerCase().replace(/net/g, 'dotnet').replace(/dotnet/g, 'asp.net');
        if (any(fields, netQuery)) matches = true;
      }
      
      // Special handling for Swift - check for swift, swiftui, ios
      if (q.toLowerCase().includes('swift') || q.toLowerCase().includes('syit') || q.toLowerCase().includes('swiftui')) {
        const swiftQuery = q.toLowerCase().replace(/syit/g, 'swift').replace(/swift/g, 'swiftui');
        if (any(fields, swiftQuery)) matches = true;
      }
      
      // Additional fallback search for known terms
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
          'next.js', 'nextjs', 'nuxt', 'svelte', 'jquery', 'lodash',
          'webpack', 'vite', 'babel', 'eslint', 'prettier', 'jest', 'cypress',
          'graphql', 'rest', 'api', 'microservices', 'serverless',
          'tensorflow', 'pytorch', 'machine learning', 'ai', 'artificial intelligence',
          'blockchain', 'ethereum', 'solidity', 'web3', 'cryptocurrency'
        ];
        
        const professionTerms = [
          'utvecklare', 'developer', 'programmerare', 'programmer', 'kodare', 'coder',
          'webbutvecklare', 'web developer', 'apputvecklare', 'app developer',
          'frontend', 'frontend utvecklare', 'frontend developer', 'backend', 'backend utvecklare', 'backend developer',
          'fullstack', 'fullstack utvecklare', 'fullstack developer', 'full-stack', 'full-stack utvecklare', 'full-stack developer',
          'systemutvecklare', 'system developer', 'mjukvaruutvecklare', 'software developer',
          'mobila utvecklare', 'mobile developer', 'ios utvecklare', 'ios developer',
          'android utvecklare', 'android developer', 'data scientist', 'dataanalytiker',
          'data engineer', 'dataingenjör', 'devops engineer', 'devops ingenjör',
          'cloud engineer', 'cloud ingenjör', 'security engineer', 'säkerhetsingenjör',
          'test engineer', 'testare', 'tester', 'qa engineer', 'quality assurance',
          'tech lead', 'teknisk ledare', 'arkitekt', 'architect', 'consultant', 'konsult'
        ];
        
        const cityTerms = [
          'stockholm', 'göteborg', 'goteborg', 'malmö', 'malmo', 'uppsala', 'västerås', 
          'vasteras', 'örebro', 'orebro', 'linköping', 'linkoping', 'helsingborg', 
          'lund', 'norrköping', 'norrkoping', 'umeå', 'umea', 'luleå', 'lulea',
          'växjö', 'vaxjo', 'karlstad', 'jönköping', 'jonkoping', 'borås', 'boras',
          'eskilstuna', 'sundsvall', 'gävle', 'gavle', 'huddinge', 'nacka', 'solna',
          'södertälje', 'sodertalje', 'hässleholm', 'hassleholm', 'östersund', 'ostersund',
          'trollhättan', 'trollhattan', 'kristianstad', 'karlskrona', 'skövde', 'skovde',
          'uddevalla', 'landskrona', 'motala', 'piteå', 'pitea', 'vänersborg', 'vanersborg',
          'borlänge', 'borlange', 'säffle', 'saffle', 'kungsbacka', 'kristinehamn',
          'karlshamn', 'falkenberg', 'sandviken', 'varberg', 'trelleborg', 'lindesberg',
          'kramfors', 'haparanda', 'kristianstad', 'hässleholm', 'hassleholm'
        ];
        
        const queryWords = normalizedQuery.split(" ").filter(w => w.length > 1);
        
        // Check if any query word matches any known term with fuzzy matching
        const hasKnownTerms = queryWords.some(word => 
          [...programmingTerms, ...professionTerms, ...cityTerms].some(term => {
            // Exact substring match
            if (term.includes(word) || word.includes(term)) return true;
            
            // Fuzzy match with Levenshtein distance
            const maxDist = word.length <= 4 ? 1 : word.length <= 7 ? 2 : 3;
            if (levenshtein(term, word) <= maxDist) return true;
            
            // Character similarity for typos
            if (word.length > 3 && term.length > 3) {
              const commonChars = [...word].filter(char => term.includes(char)).length;
              const similarity = commonChars / Math.max(word.length, term.length);
              if (similarity >= 0.6) return true; // 60% similarity for known terms
            }
            
            return false;
          })
        );
        
        // Also check if any field contains any part of the query (very flexible)
        const hasPartialMatch = fields.some(field => 
          queryWords.some(word => 
            normalize(field).includes(word) && word.length > 2
          )
        );
        
        
        if (hasKnownTerms || hasPartialMatch) {
          matches = true;
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
    const employer = normalize(ad.employer?.name ?? "");
    
    // Exact matches get highest score
    if (normQ && headline.includes(normQ)) s += 10;
    if (normQ && occupation.includes(normQ)) s += 8;
    if (normQ && description.includes(normQ)) s += 6;
    if (normQ && employer.includes(normQ)) s += 4;
    
    // Word-by-word scoring for flexible matching
    if (normQ) {
      const queryWords = normQ.split(" ").filter(w => w.length > 1);
      
      queryWords.forEach(word => {
        // Headline matches get highest score
        if (headline.includes(word)) s += 6;
        if (occupation.includes(word)) s += 5;
        if (description.includes(word)) s += 3;
        if (employer.includes(word)) s += 2;
        
        // Partial word matches
        if (headline.includes(word.substring(0, Math.max(3, word.length - 1)))) s += 3;
        if (occupation.includes(word.substring(0, Math.max(3, word.length - 1)))) s += 2;
      });
    }
    
    // Programming language and framework bonus
    if (normQ) {
      const programmingTerms = [
        'javascript', 'js', 'typescript', 'ts', 'python', 'java', 'c#', 'csharp', 'c sharp',
        'php', 'ruby', 'go', 'rust', 'swift', 'kotlin', 'scala', 'r',
        'react', 'vue', 'angular', 'node', 'express', 'django', 'flask',
        'spring', 'laravel', 'symfony', 'rails', 'asp.net', 'dotnet', 'asp net', 'net', 'nf',
        'swift', 'swiftui', 'ios', 'android', 'kotlin', 'flutter', 'dart'
      ];
      
      const professionTerms = [
        'developer', 'utvecklare', 'programmer', 'programmerare', 'coder', 'kodare',
        'frontend', 'backend', 'fullstack', 'full-stack', 'full stack',
        'webbutvecklare', 'web developer', 'apputvecklare', 'app developer'
      ];
      
      const queryWords = normQ.split(" ");
      queryWords.forEach(word => {
        // Programming terms bonus
        programmingTerms.forEach(term => {
          if (term.includes(word) || word.includes(term)) {
            if (description.includes(term)) s += 2;
            if (headline.includes(term)) s += 3;
            if (occupation.includes(term)) s += 4;
          }
        });
        
        // Profession terms bonus
        professionTerms.forEach(term => {
          if (term.includes(word) || word.includes(term)) {
            if (headline.includes(term)) s += 4;
            if (occupation.includes(term)) s += 5;
            if (description.includes(term)) s += 2;
          }
        });
      });
    }
    
    // Location bonus
    if (hasLoc && normalize(ad.workplace_address?.municipality ?? "").includes(loc)) s += 3;
    
    return -s; // lower is better
  };

  return filtered.sort((a,b)=> score(a)-score(b));
}
