import { useState, memo } from 'react';
import DOMPurify from 'dompurify';
import { Building2, MapPinned, ExternalLink, BookmarkPlus } from 'lucide-react';
import type { JoobleJob } from '../services/joobleApi';
import { JobDetailModal } from './JobDetailModal';
import { isSafeUrl } from '../utils/urlUtils';

interface JobSearchResultsProps {
  results: JoobleJob[];
  onSaveJob: (job: JoobleJob) => void;
}

const formatDate = (isoString: string): string => {
  if (!isoString) return 'Recent';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return 'Recent';
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
};

export const JobSearchResults = memo<JobSearchResultsProps>(({ results, onSaveJob }) => {
  const [viewJob, setViewJob] = useState<JoobleJob | null>(null);

  return (
    <div>
      {/* HTML-02: p instead of h3 — avoids skipping heading levels (h1→h3) */}
      <p className="jsr-grid-header">Found {results.length} matched jobs</p>
      <div className="jobs-grid">
        {results.map((job) => (
          <div key={job.id || `${job.company}-${job.title}-${job.link}`} className="card jsr-card">
            <div className="jsr-card-header">
              <div className="jsr-brand-icon">
                <Building2 size={24} />
              </div>
              <div>
                <h4 className="jsr-job-title">{job.title}</h4>
                <p className="jsr-job-company">{job.company || 'Confidential'}</p>
              </div>
            </div>

            <div className="jsr-badge-row">
              <span className="badge jsr-badge">
                <MapPinned size={12} className="icon-mr" />
                {job.location || 'Remote / Unspecified'}
              </span>
              {job.type && (
                <span className="badge jsr-badge">{job.type}</span>
              )}
            </div>

            <div
              className="jsr-snippet"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(job.snippet) }}
            />

            <div className="jsr-card-footer">
              <span className="jsr-posted-date">Posted {formatDate(job.updated)}</span>
              <div className="jsr-btn-row">
                <button onClick={() => setViewJob(job)} className="btn jsr-btn-view">
                  View Details
                </button>
                <button onClick={() => onSaveJob(job)} className="btn jsr-btn-save" title="Save to Tracker">
                  Save <BookmarkPlus size={14} className="icon-ml" />
                </button>
                {/* SEC-03: Only render if URL is a safe http(s) link */}
                {isSafeUrl(job.link) && (
                  <a href={job.link} target="_blank" rel="noopener noreferrer" className="btn jsr-btn-apply">
                    Apply <ExternalLink size={14} className="icon-ml" />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {viewJob && (
        <JobDetailModal
          job={{
            title: viewJob.title,
            company: viewJob.company || 'Unknown',
            location: viewJob.location,
            date: viewJob.updated ? new Date(viewJob.updated).toLocaleDateString() : 'Recent',
            descriptionSnippet: DOMPurify.sanitize(viewJob.snippet),
            link: viewJob.link,
            type: viewJob.type
          }}
          onClose={() => setViewJob(null)}
        />
      )}
    </div>
  );
});

JobSearchResults.displayName = 'JobSearchResults';
