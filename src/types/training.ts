export type TrainingStatus = 'planned' | 'in_progress' | 'completed';
export type TrainingType   = 'internal' | 'external' | 'ojt';

export type Training = {
  id: string;
  title: string;
  type: TrainingType;
  status: TrainingStatus;
  planned_date: string;
  actual_date: string | null;
  total_count: number;
  completed_count: number;
  purpose: string | null;
  created_at: string;
  updated_at: string;
};
