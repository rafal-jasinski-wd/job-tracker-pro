import { memo } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import type { Job } from '../types/job';
import { KanbanCard } from './KanbanCard';

interface KanbanColumnProps {
  id: Job['status'];
  title: string;
  jobs: Job[];
  onDeleteJob: (id: string) => void;
  onEditJob: (job: Job) => void;
  onViewJob: (job: Job) => void;
}

export const KanbanColumn = memo(({ id, title, jobs, onDeleteJob, onEditJob, onViewJob }: KanbanColumnProps) => {
  return (
    <div className={`kanban-column kanban-column--${id}`}>
      <div className="kanban-column-header">
        <h3 className="kanban-column-title">{title}</h3>
        <span className="kanban-column-count">{jobs.length}</span>
      </div>

      <Droppable droppableId={id}>
        {(provided, snapshot) => (
          <div
            className={`kanban-droppable ${snapshot.isDraggingOver ? 'drag-over' : ''}`}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {jobs.length === 0 ? (
              <div className="kanban-empty">Drop jobs here</div>
            ) : (
              jobs.map((job, index) => (
                <KanbanCard
                  key={job.id}
                  job={job}
                  index={index}
                  onDeleteJob={onDeleteJob}
                  onEditJob={onEditJob}
                  onViewJob={onViewJob}
                />
              ))
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
});

KanbanColumn.displayName = 'KanbanColumn';
