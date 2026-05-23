import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import JobTable from './components/JobTable';
import AddJobModal from './components/AddJobModal';
import JobDetailsPanel from './components/JobDetailsPanel';

export default function App() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchJobs = useCallback(async () => {
    try {
      const { data } = await axios.get('/api/jobs');
      setJobs(data);
      if (selectedJob) {
        const updated = data.find(j => j.id === selectedJob.id);
        setSelectedJob(updated || null);
      }
    } catch {
      setError('Could not connect to backend. Make sure it is running on port 5000.');
    } finally {
      setLoading(false);
    }
  }, [selectedJob]);

  useEffect(() => { fetchJobs(); }, []);

  const handleAdd = async (formData) => {
    await axios.post('/api/jobs', formData);
    setShowModal(false);
    fetchJobs();
  };

  const handleUpdate = async (id, formData) => {
    const { data } = await axios.put(`/api/jobs/${id}`, formData);
    setEditingJob(null);
    setSelectedJob(data);
    fetchJobs();
  };

  const handleDelete = async (id) => {
    await axios.delete(`/api/jobs/${id}`);
    setSelectedJob(null);
    fetchJobs();
  };

  const openEdit = (job) => {
    setEditingJob(job);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingJob(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Job Tracker</h1>
          <p className="text-sm text-gray-500 mt-0.5">{jobs.length} application{jobs.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center gap-2"
        >
          <span className="text-lg leading-none">+</span> Add Job
        </button>
      </header>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        <main className={`flex-1 overflow-auto p-6 transition-all duration-300 ${selectedJob ? 'mr-0' : ''}`}>
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
