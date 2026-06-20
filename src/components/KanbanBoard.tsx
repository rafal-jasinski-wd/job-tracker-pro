import { memo, useCallback, useOptimistic, startTransition } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';
import { type Job, isJobStatus } from '../types/job';
import { KanbanColumn } from './KanbanColumn';

interface KanbanBoardProps {
  jobs: Job[];
  onUpdateJob: (job: Job) => void;
  onDeleteJob: (id: string) => void;
  onEditJob: (job: Job) => void;
  onViewJob: (job: Job) => void;
}

const COLUMNS: { id: Job['status']; title: string }[] = [
  { id: 'applied', title: 'Applied' },
  { id: 'interview', title: 'Interview' },
  { id: 'offer', title: 'Offer' },
  { id: 'rejected', title: 'Rejected' },
];

export const KanbanBoard = memo(({ jobs, onUpdateJob, onDeleteJob, onEditJob, onViewJob }: KanbanBoardProps) => {
  const [optimisticJobs, setOptimisticJobs] = useOptimistic<Job[], Job>(
    jobs,
    (state, updatedJob) => state.map(j => j.id === updatedJob.id ? updatedJob : j)
  );

  const onDragEnd = useCallback((result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    // Find the dragged job
    const draggedJob = jobs.find(j => j.id === draggableId);
    if (!draggedJob) return;

    const newStatus = destination.droppableId;
    if (isJobStatus(newStatus) && draggedJob.status !== newStatus) {
      const updatedJob = { ...draggedJob, status: newStatus };
      
      // React 19: Optimistically update the UI instantly while the API request processes
      startTransition(() => {
        setOptimisticJobs(updatedJob);
        onUpdateJob(updatedJob);
      });
    }
  }, [jobs, onUpdateJob, setOptimisticJobs]);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="kanban-board">
        {COLUMNS.map(col => (
          <KanbanColumn
            key={col.id}
            id={col.id}
            title={col.title}
            jobs={optimisticJobs.filter(job => job.status === col.id)}
            onDeleteJob={onDeleteJob}
            onEditJob={onEditJob}
            onViewJob={onViewJob}
          />
        ))}
      </div>
    </DragDropContext>
  );
});

KanbanBoard.displayName = 'KanbanBoard';
