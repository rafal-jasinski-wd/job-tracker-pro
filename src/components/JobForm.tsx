import React, { useState } from 'react';
import type { Job } from '../types/job';
import { X } from 'lucide-react';

interface JobFormProps {
  onSubmit: (job: Job) => void;
  onCancel: () => void;
}

export const JobForm: React.FC<JobFormProps> = ({ onSubmit, onCancel }) => {
  const [company, setCompany] = useState('');
  const [position, setPosition] = useState('');
  const [status, setStatus] = useState<Job['status']>('applied');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim() || !position.trim() || !date) {
      setError('Company, position, and date are required.');
      return;
    }

    const newJob: Job = {
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      company: company.trim(),
      position: position.trim(),
      status,
      date,
      notes: notes.trim()
    };

    onSubmit(newJob);
    // Form will reset naturally if it is unmounted, but we reset anyway:
    setCompany('');
    setPosition('');
    setStatus('applied');
    setDate(newJob.date);
    setNotes('');
    setError('');
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
    }}>
      <div className="card" style={{ width: '100%', maxWidth: '500px', margin: '1rem', position: 'relative', animation: 'fadeIn 0.2s ease-out' }}>
        <button 
          onClick={onCancel} 
          style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
        >
          <X size={20} />
        </button>
        
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem' }}>Add Application</h2>
        
        {error && (
          <div style={{ padding: '0.75rem', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Company *</label>
            <input 
              type="text" 
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-color)', color: 'var(--text-main)', outline: 'none' }}
              placeholder="e.g. Acme Corp"
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Position *</label>
            <input 
              type="text" 
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-color)', color: 'var(--text-main)', outline: 'none' }}
              placeholder="e.g. Frontend Developer"
            />
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Status</label>
              <select 
                value={status}
                onChange={(e) => setStatus(e.target.value as Job['status'])}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-color)', color: 'var(--text-main)', outline: 'none' }}
              >
                <option value="applied">Applied</option>
                <option value="interview">Interview</option>
                <option value="offer">Offer</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Date *</label>
              <input 
                type="date" 
                value={date}
                onChange={(e) => setDate(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-color)', color: 'var(--text-main)', outline: 'none' }}
              />
            </div>
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Notes</label>
            <textarea 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-color)', color: 'var(--text-main)', resize: 'vertical', outline: 'none' }}
              placeholder="Any additional details..."
            />
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
            <button type="button" onClick={onCancel} className="btn" style={{ backgroundColor: 'transparent', color: 'var(--text-main)', border: '1px solid var(--border)' }}>
              Cancel
            </button>
            <button type="submit" className="btn">
              Save Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
