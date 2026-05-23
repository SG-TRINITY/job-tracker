import React, { useState, useEffect } from 'react';
import axios from 'axios';
import JobTable from './components/JobTable';
import AddJobModal from './components/AddJobModal';
import JobDetailsPanel from './components/JobDetailsPanel';
import './App.css';

function App() {
  const [jobs, setJobs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingJob, setEditingJob] = useState(null);

  // Fetch jobs on mount
  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/jobs');
      setJobs(response.data || []);
      setError(null);
    } catch (err) {
      setError('Failed to fetch jobs');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddJob = async (jobData) => {
    try {
      if (editingJob) {
        // Update existing job
        const response = await axios.put(`/api/jobs/${editingJob.id}`, jobData);
        setJobs(jobs.map(job => job.id === editingJob.id ? response.data : job));
        setEditingJob(null);
      } else {
        // Create new job
        const response = await axios.post('/api/jobs', jobData);
        setJobs([response.data, ...jobs]);
      }
      setShowModal(false);
      setSelectedJob(null);
    } catch (err) {
      setError('Failed to save job');
      console.error(err);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job?')) {
      return;
    }

    try {
      await axios.delete(`/api/jobs/${jobId}`);
      setJobs(jobs.filter(job => job.id !== jobId));
      setSelectedJob(null);
      setError(null);
    } catch (err) {
      setError('Failed to delete job');
      console.error(err);
    }
  };

  const handleEditJob = (job) => {
    setEditingJob(job);
    setShowModal(true);
  };

  const handleRowClick = (job) => {
    setSelectedJob(job);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingJob(null);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Job Tracker</h1>
            <button
              onClick={() => {
                setEditingJob(null);
                setShowModal(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
            >
              + Add Job
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto">
          {error && (
            <div className="mx-4 mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <p className="text-gray-500">Loading jobs...</p>
            </div>
          ) : jobs.length === 0 ? (
            <div className="flex justify-center items-center h-full">
              <div className="text-center">
                <p className="text-gray-500 text-lg mb-4">No jobs yet</p>
                <button
                  onClick={() => {
                    setEditingJob(null);
                    setShowModal(true);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
                >
                  Add your first job
                </button>
              </div>
            </div>
          ) : (
            <div className="p-6">
              <JobTable
                jobs={jobs}
                onRowClick={handleRowClick}
                selectedJobId={selectedJob?.id}
              />
            </div>
          )}
        </main>
      </div>

      {/* Side panel for job details */}
      {selectedJob && (
        <JobDetailsPanel
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
          onEdit={handleEditJob}
          onDelete={handleDeleteJob}
        />
      )}

      {/* Modal for adding/editing jobs */}
      {showModal && (
        <AddJobModal
          onClose={handleCloseModal}
          onSubmit={handleAddJob}
          initialData={editingJob}
        />
      )}
    </div>
  );
}

export default App;
