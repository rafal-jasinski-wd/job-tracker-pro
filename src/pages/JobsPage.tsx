import { useState, useRef } from 'react';
import { Search, MapPin, Briefcase, Loader2, Globe } from 'lucide-react';
import { fetchJoobleJobs, type JoobleJob } from '../services/joobleApi';
import { JobSearchResults } from '../components/JobSearchResults';

interface JobsPageProps {
  onSaveJob: (job: JoobleJob) => void;
}

const COUNTRY_MAP: Record<string, string> = {
  'us': 'USA', 'gb': 'UK', 'ie': 'Ireland', 'ca': 'Canada',
  'au': 'Australia', 'de': 'Germany', 'pl': 'Poland', 'nl': 'Netherlands'
};

export const JobsPage = ({ onSaveJob }: JobsPageProps) => {
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [country, setCountry] = useState('ie');
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<JoobleJob[]>([]);

  // Cancels the previous in-flight request when a new search starts
  const abortRef = useRef<AbortController | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim() && !location.trim()) return;

    // Cancel any in-flight request before starting a new one
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    setIsSearching(true);
    setError(null);
    setHasSearched(true);

    const countryName = COUNTRY_MAP[country.toLowerCase()] || '';
    const searchLocation = location.trim()
      ? `${location.trim()}, ${countryName}`
      : countryName;

    try {
      const data = await fetchJoobleJobs(keyword, searchLocation, abortRef.current.signal);
      setResults(data);
    } catch (err: unknown) {
      // Only skip the error state update if the request was intentionally cancelled
      if (!(err instanceof Error && err.name === 'AbortError')) {
        const message = err instanceof Error ? err.message : 'An error occurred while fetching jobs from Jooble.';
        setError(message);
        setResults([]);
      }
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="main-content">
      <h1 className="page-title">Find Jobs</h1>
      <p className="page-subtitle">Search and discover new career opportunities securely via Jooble.</p>

      <div className="card search-card">
        <form onSubmit={handleSearch} className="search-form">

          <div>
            <label className="form-label">Keywords</label>
            <div className="search-field">
              <Search size={18} className="search-field-icon" />
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Job title, skills..."
                className="search-input"
                maxLength={100}
              />
            </div>
          </div>

          <div>
            <label className="form-label">Location</label>
            <div className="search-field">
              <MapPin size={18} className="search-field-icon" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City, region..."
                className="search-input"
                maxLength={100}
              />
            </div>
          </div>

          <div>
            <label className="form-label">Country</label>
            <div className="search-field">
              <Globe size={18} className="search-field-icon" />
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="search-select"
              >
                <option value="ie">Ireland</option>
                <option value="gb">United Kingdom</option>
                <option value="us">United States</option>
                <option value="ca">Canada</option>
                <option value="au">Australia</option>
                <option value="de">Germany</option>
                <option value="pl">Poland</option>
                <option value="nl">Netherlands</option>
              </select>
            </div>
          </div>

          <div className="search-btn-wrap">
            <button type="submit" className="btn search-btn" disabled={isSearching}>
              {isSearching ? <Loader2 size={20} className="spinner" /> : 'Search Jobs'}
            </button>
          </div>

        </form>
      </div>

      <div className="results-container">
        {isSearching ? (
          <div className="empty-state empty-state--min-h-30">
            <Loader2 size={40} color="var(--primary)" className="spinner empty-spinner" />
            <p className="search-scanning-text">Scanning active job boards via Jooble...</p>
          </div>
        ) : error ? (
          <div className="empty-state empty-state--error empty-state--min-h-30">
            <h3 className="empty-title empty-title--error">Search Failed</h3>
            <p className="empty-text empty-text--error">{error}</p>
          </div>
        ) : hasSearched && results.length === 0 ? (
          <div className="empty-state empty-state--min-h-30">
            <Briefcase size={48} className="empty-icon icon-dim-50" />
            <h3 className="empty-title">No matching jobs found</h3>
            <p className="empty-text">
              Try adjusting your search criteria, simplifying your keywords, or expanding your location scope.
            </p>
            <button
              className="btn btn--ghost"
              onClick={() => { setKeyword(''); setLocation(''); setHasSearched(false); setResults([]); }}
            >
              Clear Search
            </button>
          </div>
        ) : hasSearched && results.length > 0 ? (
          <JobSearchResults results={results} onSaveJob={onSaveJob} />
        ) : (
          <div className="empty-state empty-state--transparent empty-state--min-h-30">
            <Briefcase size={48} className="empty-icon icon-dim-30" />
            <h3 className="empty-title">Ready to find your next role?</h3>
            <p className="empty-text">Enter a keyword or location above to discover active jobs via Jooble.</p>
          </div>
        )}
      </div>
    </div>
  );
};
