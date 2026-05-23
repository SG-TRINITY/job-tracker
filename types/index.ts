export interface Job {
  id: number;
  title: string;
  company: string;
  applied_date: string;
  status: string;
  location: string | null;
  salary_range: string | null;
  job_url: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export type JobFormData = Omit<Job, 'id' | 'created_at' | 'updated_at'>;
