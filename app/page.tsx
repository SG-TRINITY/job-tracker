'use client';

import { useState, useEffect, useCallback } from 'react';
import JobTable from '@/components/JobTable';
import AddJobModal from '@/components/AddJobModal';
import JobDetailsPanel from '@/components/JobDetailsPanel';
import type { Job, JobFormData } from '@/types';

export default function Page() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = useCallback(async (currentSelected?: Job | null) => {
    try {
      const res = await fetch('/api/jobs');
      if (!res.ok) throw new Error();
      const data: Job[] = await res.json();
      setJobs(data);
      const sel = currentSelected ?? null;
      if (sel) setSelectedJob(data.find(j => j.id === sel.id) ?? null);
    } catch {
      setError('Failed to load jobs.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  const handleAdd = async (formData: JobFormData) => {
    await fetch('/api/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    setShowModal(false);
    fetchJobs();
  };

  const handleUpdate = async (id: number, formData: JobFormData) => {
    const res = await fetch(`/api/jobs/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    const updated: Job = await res.json();
    setEditingJob(null);
    setSelectedJob(updated);
    fetchJobs(updated);
  };

  const handleDelete = async (id: number) => {
    await fetch(`/api/jobs/${id}`, { method: 'DELETE' });
    setSelectedJob(null);
    fetchJobs();
  };

  const openEdit = (job: Job) => {
    setEditingJob(job);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingJob(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Job Tracker</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {jobs.length} application{jobs.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center gap-2"
        >
          <span className="text-lg leading-none">+</span> Add Job
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 overflow-auto p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}
          {loading ? (
            <div className="flex items-center justify-center h-64 text-gray-400">Loading...</div>
          ) : (
            <JobTable
              jobs={jobs}
              selectedJobId={selectedJob?.id}
              onSelectJob={setSelectedJob}
            />
          )}
        </main>

        {selectedJob && (
          <JobDetailsPanel
            job={selectedJob}
            onClose={() => setSelectedJob(null)}
            onEdit={() => openEdit(selectedJob)}
            onDelete={() => handleDelete(selectedJob.id)}
          />
        )}
      </div>

      {showModal && (
        <AddJobModal
          job={editingJob}
          onSubmit={editingJob ? (data) => handleUpdate(editingJob.id, data) : handleAdd}
          onClose={closeModal}
        />
      )}
    </div>
  );
}
