import { useState } from 'react';
import { FileText, Link2, ExternalLink, Pencil, Save, X } from 'lucide-react';
import { isSafeUrl } from '../utils/urlUtils';

interface ResumeVaultProps {
  resumeUrl?: string;
  coverLetterUrl?: string;
  onSave: (data: { resumeUrl?: string; coverLetterUrl?: string }) => void;
}

interface LinkFieldProps {
  label: string;
  icon: React.ReactNode;
  value?: string;
  placeholder: string;
  onSave: (url: string) => void;
  onClear: () => void;
}

const LinkField = ({ label, icon, value, placeholder, onSave, onClear }: LinkFieldProps) => {
  const [editing, setEditing] = useState(!value);
  const [draft, setDraft] = useState(value ?? '');
  const [error, setError] = useState('');

  const handleSave = () => {
    if (!draft.trim()) {
      onClear();
      setEditing(false);
      return;
    }
    if (!isSafeUrl(draft.trim())) {
      setError('Please enter a valid https:// URL.');
      return;
    }
    setError('');
    onSave(draft.trim());
    setEditing(false);
  };

  const handleEdit = () => {
    setDraft(value ?? '');
    setEditing(true);
  };

  return (
    <div style={{ marginBottom: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
        {icon}
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>{label}</span>
      </div>

      {editing ? (
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', flexDirection: 'column' }}>
          <div style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
            <input
              type="url"
              className="form-input"
              placeholder={placeholder}
              value={draft}
              onChange={(e) => { setDraft(e.target.value); setError(''); }}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              style={{ flex: 1, fontSize: '0.85rem' }}
              autoFocus
            />
            <button onClick={handleSave} className="btn" title="Save" style={{ padding: '0.45rem 0.75rem', flexShrink: 0 }}>
              <Save size={14} />
            </button>
            {value && (
              <button onClick={() => setEditing(false)} className="btn btn--ghost" title="Cancel" style={{ padding: '0.45rem 0.75rem', flexShrink: 0 }}>
                <X size={14} />
              </button>
            )}
          </div>
          {error && <span style={{ fontSize: '0.8rem', color: '#ef4444' }}>{error}</span>}
        </div>
      ) : value ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="btn"
            style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            Open <ExternalLink size={13} />
          </a>
          <button onClick={handleEdit} className="btn btn--ghost" title="Edit link" style={{ padding: '0.35rem 0.6rem' }}>
            <Pencil size={13} />
          </button>
          <button onClick={() => { onClear(); setDraft(''); setEditing(true); }} className="btn btn--ghost" title="Remove link" style={{ padding: '0.35rem 0.6rem', color: '#ef4444' }}>
            <X size={13} />
          </button>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', wordBreak: 'break-all', flex: 1 }}>
            {value.length > 60 ? value.slice(0, 60) + '...' : value}
          </span>
        </div>
      ) : (
        <button
          onClick={() => setEditing(true)}
          className="btn btn--ghost"
          style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <Link2 size={13} /> Attach link
        </button>
      )}
    </div>
  );
};

export const ResumeVault = ({ resumeUrl, coverLetterUrl, onSave }: ResumeVaultProps) => {
  return (
    <div
      className="modal-section"
      style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}
    >
      <h4
        className="modal-section-title"
        style={{ margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
      >
        <FileText size={16} /> Resume Vault
      </h4>

      <div
        className="modal-content-box"
        style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}
      >
        <LinkField
          label="Resume"
          icon={<FileText size={14} style={{ color: 'var(--primary)' }} />}
          value={resumeUrl}
          placeholder="Paste Google Drive, Dropbox, or OneDrive link..."
          onSave={(url) => onSave({ resumeUrl: url, coverLetterUrl })}
          onClear={() => onSave({ resumeUrl: undefined, coverLetterUrl })}
        />

        <LinkField
          label="Cover Letter"
          icon={<FileText size={14} style={{ color: '#a78bfa' }} />}
          value={coverLetterUrl}
          placeholder="Paste Google Drive, Dropbox, or OneDrive link..."
          onSave={(url) => onSave({ resumeUrl, coverLetterUrl: url })}
          onClear={() => onSave({ resumeUrl, coverLetterUrl: undefined })}
        />
      </div>
    </div>
  );
};
