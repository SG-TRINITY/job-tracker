import React from 'react';

const JobDetailsPanel = ({ job, onClose, onEdit, onDelete }) => {
  const getStatusColor = (status) => {
    const colors = {
      'Applied': 'text-blue-600 bg-blue-50',
      'Interviewing': 'text-purple-600 bg-purple-50',
      'Offer': 'text-green-600 bg-green-50',
      'Rejected': 'text-red-600 bg-red-50',
      'Accepted': 'text-green-700 bg-green-50',
      'Withdrawn': 'text-gray-600 bg-gray-50'
    };
    return colors[status] || 'text-gray-600 bg-gray-50';
  };

  const detailItem = (label, value) => (
    <div className="py-3 border-b border-gray-100 last:border-b-0">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
        {label}
      </p>
      <p className="text-gray-900 text-sm break-words">
        {value ? (
          typeof value === 'string' && value.startsWith('http') ? (
            <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              {value}
            </a>
          ) : (
            value
          )
        ) : (
          <span className="text-gray-400">-</span>
        )}
      </p>
    </div>
  );

  return (
    <div className="w-80 bg-white shadow-lg border-l border-gray-200 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex justify-between items-center">
        <h2 className="text-xl font-bold text-white truncate">Job Details</h2>
        <button
          onClick={onClose}
          className="text-white hover:text-gray-200 transition duration-200 flex-shrink-0"
        >
          ✕
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Title */}
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{job.title}</h3>
        <p className="text-lg text-gray-600 mb-4">{job.company}</p>

        {/* Status */}
        <div className={`px-3 py-2 rounded-lg inline-block mb-6 ${getStatusColor(job.status)}`}>
          <span className="text-sm font-semibold">{job.status}</span>
        </div>

        {/* Details */}
        <div className="space-y-0">
          {detailItem('Application Date', new Date(job.applicationDate).toLocaleDateString())}
          {detailItem('Location', job.location)}
          {detailItem('Salary Range', job.salaryRange)}
          {detailItem('Job URL', job.jobUrl)}
          {detailItem('Notes', job.notes)}
          {detailItem('Applied On', new Date(job.createdAt).toLocaleString())}
          {job.updatedAt && job.createdAt !== job.updatedAt && 
            detailItem('Last Updated', new Date(job.updatedAt).toLocaleString())
          }
        </div>
      </div>

      {/* Footer with actions */}
      <div className="bg-gray-50 border-t border-gray-200 p-4 flex gap-3">
        <button
          onClick={() => onEdit(job)}
          className="flex-1 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(job.id)}
          className="flex-1 px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition duration-200"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default JobDetailsPanel;
