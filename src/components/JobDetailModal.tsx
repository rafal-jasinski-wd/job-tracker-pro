import { useEffect, useRef, useState } from 'react';
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
  aiInterviewPrep?: string;
  resumeUrl?: string;
  coverLetterUrl?: string;
}

interface JobDetailModalProps {
  job: JobDetailData;
  onClose: () => void;
  onUpdateJob?: (job: any) => void;
}

import { generateMockInterview } from '../services/aiApi';
import ReactMarkdown from 'react-markdown';
import { Sparkles, Loader2 } from 'lucide-react';
import { ResumeVault } from './ResumeVault';

export const JobDetailModal = ({ job, onClose, onUpdateJob }: JobDetailModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiError, setAiError] = useState('');
  // Local state for AI text to allow immediate viewing even if onUpdateJob isn't passed (e.g. Search results)
  const [localAiText, setLocalAiText] = useState(job.aiInterviewPrep || '');

  const handleGenerateAI = async () => {
    setIsGeneratingAI(true);
    setAiError('');
    try {
      const result = await generateMockInterview(job);
      setLocalAiText(result);
      if (onUpdateJob) {
        onUpdateJob({ ...job, aiInterviewPrep: result });
      }
    } catch (err: any) {
      setAiError(err.message || 'Failed to generate prep.');
    } finally {
      setIsGeneratingAI(false);
    }
  };

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

          <ResumeVault
            resumeUrl={job.resumeUrl}
            coverLetterUrl={job.coverLetterUrl}
            onSave={(data) => {
              if (onUpdateJob) onUpdateJob({ ...job, ...data });
            }}
          />

          <div className="modal-section" style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h4 className="modal-section-title" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)' }}>
                <Sparkles size={18} /> AI Interview Prep
              </h4>
              {!localAiText && (
                <button 
                  onClick={handleGenerateAI} 
                  disabled={isGeneratingAI}
                  className="btn" 
                  style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                >
                  {isGeneratingAI ? <Loader2 size={16} className="spinner" /> : 'Generate Mock Interview'}
                </button>
              )}
            </div>

            {aiError && (
              <div style={{ color: '#ef4444', fontSize: '0.85rem', marginBottom: '1rem' }}>{aiError}</div>
            )}

            {localAiText && (
              <div className="modal-content-box" style={{ background: 'color-mix(in srgb, var(--primary) 5%, transparent)', border: '1px solid color-mix(in srgb, var(--primary) 20%, transparent)' }}>
                <ReactMarkdown>{localAiText}</ReactMarkdown>
              </div>
            )}
            {isGeneratingAI && !localAiText && (
               <div className="modal-content-box" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                 <div className="skeleton-text" style={{ width: '100%', height: '14px', background: 'var(--border)', borderRadius: '4px', animation: 'pulse 1.5s infinite' }} />
                 <div className="skeleton-text" style={{ width: '90%', height: '14px', background: 'var(--border)', borderRadius: '4px', animation: 'pulse 1.5s infinite 0.2s' }} />
                 <div className="skeleton-text" style={{ width: '80%', height: '14px', background: 'var(--border)', borderRadius: '4px', animation: 'pulse 1.5s infinite 0.4s' }} />
               </div>
            )}
          </div>

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
