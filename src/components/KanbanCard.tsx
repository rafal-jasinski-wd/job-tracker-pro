import { memo } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Building2, Calendar, Pencil, Trash2, Eye } from 'lucide-react';
import type { Job } from '../types/job';


interface KanbanCardProps {
  job: Job;
  index: number;
  onDeleteJob: (id: string) => void;
  onEditJob: (job: Job) => void;
  onViewJob: (job: Job) => void;
}

export const KanbanCard = memo(({ job, index, onDeleteJob, onEditJob, onViewJob }: KanbanCardProps) => {
  // Format date natively
  const dateObj = new Date(job.date);
  const formattedDate = isNaN(dateObj.getTime())
    ? job.date
    : dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

  return (
    <Draggable draggableId={job.id} index={index}>
      {(provided, snapshot) => (
        <div
          className={`card kanban-card ${snapshot.isDragging ? 'is-dragging' : ''}`}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <div className="kanban-card-header">
            <h4 className="kanban-card-title">{job.position}</h4>
            <div className="kanban-card-actions">
              <button className="kanban-action-btn" onClick={() => onViewJob(job)} title="View Detail">
                <Eye size={14} />
              </button>
              <button className="kanban-action-btn" onClick={() => onEditJob(job)} title="Edit">
                <Pencil size={14} />
              </button>
              <button className="kanban-action-btn delete" onClick={() => onDeleteJob(job.id)} title="Delete">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
          <div className="kanban-card-company">
            <Building2 size={12} className="icon-mr" />
            {job.company}
          </div>

          {job.interviewDate && (
            <div style={{ marginTop: '0.6rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Calendar size={12} />
              Interview: {new Date(job.interviewDate).toLocaleDateString([], { month: 'short', day: 'numeric' })}
            </div>
          )}
          
          <div className="kanban-card-footer">
            <span className="kanban-card-date">
              <Calendar size={12} className="icon-mr" />
              {formattedDate}
            </span>
          </div>
        </div>
      )}
    </Draggable>
  );
});

KanbanCard.displayName = 'KanbanCard';
