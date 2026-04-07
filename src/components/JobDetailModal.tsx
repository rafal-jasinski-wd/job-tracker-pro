import { useEffect, useRef } from 'react';
import DOMPurify from 'dompurify';
import { X, Building2, MapPinned, Calendar, ExternalLink } from 'lucide-react';
import { isSafeUrl } from '../utils/urlUtils';

export interface JobDetailData {
  title: string;
  company: string;
  location?: string;
  status?: string;
  date: string;
  descriptionSnippet?: string;
  notes?: string;
  link?: string;
  type?: string;
}

interface JobDetailModalProps {
  job: JobDetailData;
  onClose: () => void;
}

export const JobDetailModal = ({ job, onClose }: JobDetailModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Keyboard handling: Escape closes the modal, Tab is trapped inside
  useEffect(() => {
    const focusable = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;

      const els = Array.from(
        modalRef.current?.querySelectorAll<HTMLElement>(focusable) ?? []
      ).filter(el => !el.hasAttribute('disabled'));

      if (els.length === 0) return;
      const first = els[0];
      const last = els[els.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };

    // Focus first focusable element on mount
    const firstFocusable = modalRef.current?.querySelector<HTMLElement>(focusable);
    firstFocusable?.focus();

    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        ref={modalRef}
        className="modal-box"
        role="dialog"
        aria-modal="true"
        aria-labelledby="job-detail-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 id="job-detail-title" className="modal-title">Job Details</h2>
          <button onClick={onClose} className="modal-close-btn" title="Close">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div className="modal-job-header">
            <div className="modal-job-icon">
              <Building2 size={28} />
            </div>
            <div>
              <h3 className="modal-job-title">{job.title}</h3>
              <p className="modal-job-company">{job.company}</p>
            </div>
          </div>

          <div className="modal-badges">
            {job.location && (
              <span className="badge modal-badge">
                <MapPinned size={14} /> {job.location}
              </span>
            )}
            {job.date && (
              <span className="badge modal-badge">
                <Calendar size={14} /> {job.date}
              </span>
            )}
            {job.type && (
              <span className="badge modal-badge">{job.type}</span>
            )}
            {job.status && (
              <span className={`badge ${job.status}`}>
                {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
              </span>
            )}
          </div>

          {job.descriptionSnippet && (
            <div className="modal-section">
              <h4 className="modal-section-title">Description Snippet</h4>
              <div
                className="modal-content-box"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(job.descriptionSnippet) }}
              />
            </div>
          )}

          {job.notes && !job.descriptionSnippet && (
            <div className="modal-section">
              <h4 className="modal-section-title">Notes / Captured Details</h4>
              <div className="modal-content-box modal-content-box--notes">
                {job.notes}
              </div>
            </div>
          )}

          {isSafeUrl(job.link) && (
            <div className="modal-link-footer">
              <a
                href={job.link}
                target="_blank"
                rel="noopener noreferrer"
                className="btn modal-apply-btn"
              >
                View Original Posting <ExternalLink size={16} />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
