import { useState, useEffect, useRef } from 'react';
import type { Job } from '../types/job';
import { X, Calendar } from 'lucide-react';

interface JobFormProps {
  initialData?: Job;
  onSubmit: (job: Job) => void;
  onCancel: () => void;
}

export const JobForm = ({ initialData, onSubmit, onCancel }: JobFormProps) => {
  const [company, setCompany] = useState(initialData?.company || '');
  const [position, setPosition] = useState(initialData?.position || '');
  const [status, setStatus] = useState<Job['status']>(initialData?.status || 'applied');
  const [date, setDate] = useState(initialData?.date || new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [link, setLink] = useState(initialData?.link || '');
  const [interviewDate, setInterviewDate] = useState(initialData?.interviewDate || '');
  const [error, setError] = useState('');
  // Guard against double-submit on rapid button clicks
  const [submitting, setSubmitting] = useState(false);

  const formRef = useRef<HTMLDivElement>(null);

  // Keyboard handling: Escape closes the form, Tab is trapped inside
  useEffect(() => {
    const focusable = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel();
        return;
      }
      if (e.key !== 'Tab') return;

      const els = Array.from(
        formRef.current?.querySelectorAll<HTMLElement>(focusable) ?? []
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

    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onCancel]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return; // guard against double-submit
    if (!company.trim() || !position.trim() || !date) {
      setError('Company, position, and date are required.');
      return;
    }

    setSubmitting(true);

    const newJob: Job = {
      id: initialData?.id || (crypto.randomUUID ? crypto.randomUUID() : Date.now().toString()),
      company: company.trim(),
      position: position.trim(),
      status,
      date,
      notes: notes.trim(),
      link: link.trim(),
      interviewDate: status === 'interview' ? interviewDate : undefined
    };

    onSubmit(newJob);
  };

  return (
    <div className="form-backdrop" onClick={onCancel}>
      {/* ARIA role, modal, labelledby */}
      <div
        ref={formRef}
        className="card form-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="form-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onCancel} className="form-close-btn" aria-label="Close form">
          <X size={20} />
        </button>

        <h2 id="form-title" className="form-title">
          {initialData ? 'Edit Application' : 'Add Application'}
        </h2>

        {error && <div className="form-error" role="alert">{error}</div>}

        <form onSubmit={handleSubmit} className="form-body">
          <div>
            <label className="form-label">Company *</label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="form-input"
              placeholder="e.g. Acme Corp"
              maxLength={100}
            />
          </div>

          <div>
            <label className="form-label">Position *</label>
            <input
              type="text"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className="form-input"
              placeholder="e.g. Frontend Developer"
              maxLength={100}
            />
          </div>

          <div className="form-row-2">
            <div>
              <label className="form-label">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Job['status'])}
                className="form-input"
              >
                <option value="applied">Applied</option>
                <option value="interview">Interview</option>
                <option value="offer">Offer</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div>
              <label className="form-label">Date *</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          <div>
            <label className="form-label">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="form-input"
              placeholder="Any additional details..."
              maxLength={2000}
            />
          </div>

          <div>
            <label className="form-label">Application URL (Optional)</label>
            <input
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="form-input"
              placeholder="https://jooble.org/..."
            />
          </div>

          {status === 'interview' && (
            <div style={{ padding: '1rem', backgroundColor: 'var(--bg-accent)', borderRadius: '12px', border: '1px solid var(--border)' }}>
              <label className="form-label" style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Calendar size={14} /> Schedule Interview
              </label>
              <input
                type="datetime-local"
                value={interviewDate}
                onChange={(e) => setInterviewDate(e.target.value)}
                className="form-input"
                style={{ marginTop: '0.5rem' }}
              />
            </div>
          )}

          <div className="form-actions">
            <button type="button" onClick={onCancel} className="btn form-btn-cancel">
              Cancel
            </button>
            <button type="submit" className="btn" disabled={submitting}>
              {initialData ? 'Save Changes' : 'Save Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
