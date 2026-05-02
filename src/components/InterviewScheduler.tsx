import { useState, useEffect } from 'react';
import { Calendar, X, Check } from 'lucide-react';

interface InterviewSchedulerProps {
  initialDate?: string;
  onSave: (date: string | undefined) => void;
}

/** Self-contained interview date picker with save/clear controls. */
export const InterviewScheduler = ({ initialDate, onSave }: InterviewSchedulerProps) => {
  const [tempDate, setTempDate] = useState(initialDate || '');
  const [isSaved, setIsSaved] = useState(true);

  // Sync with prop changes
  useEffect(() => {
    setTempDate(initialDate || ''); // eslint-disable-line react-hooks/set-state-in-effect -- syncing local state with incoming prop
    setIsSaved(true);
  }, [initialDate]);

  const handleUpdate = () => {
    onSave(tempDate || undefined);
    setIsSaved(true);
  };

  const handleChange = (val: string) => {
    setTempDate(val);
    setIsSaved(val === (initialDate || ''));
  };

  return (
    <div className="modal-section modal-section--bordered">
      <h4 className="modal-section-title modal-section-title--icon">
        <Calendar size={18} /> Schedule Interview
      </h4>
      <div className="modal-content-box scheduler-body">
        <div className="scheduler-input-wrap">
          <label className="form-label scheduler-label">Date & Time</label>
          <input
            type="datetime-local"
            className="form-input scheduler-input"
            value={tempDate ? tempDate.slice(0, 16) : ''}
            onChange={(e) => handleChange(e.target.value)}
          />
        </div>
        <div className="scheduler-actions">
          <button 
            onClick={handleUpdate}
            disabled={isSaved}
            className={`btn scheduler-save-btn ${isSaved ? 'btn--ghost' : ''}`}
          >
            {isSaved ? <span className="scheduler-saved-label"><Check size={16} /> Saved</span> : 'Set Date'}
          </button>
          {tempDate && (
            <button 
              onClick={() => { setTempDate(''); onSave(undefined); }}
              className="btn btn--ghost scheduler-clear-btn"
              title="Clear Schedule"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
