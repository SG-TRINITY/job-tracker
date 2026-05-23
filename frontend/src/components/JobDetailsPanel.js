import React, { useState } from 'react';

const STATUS_STYLES = {
  Applied:      'bg-blue-100 text-blue-700',
  Interviewing: 'bg-yellow-100 text-yellow-700',
  Offer:        'bg-green-100 text-green-700',
  Rejected:     'bg-red-100 text-red-700',
  Accepted:     'bg-emerald-100 text-emerald-700',
  Withdrawn:    'bg-gray-100 text-gray-600',
};

export default function JobDetailsPanel({ job, onClose, onEdit, onDelete }) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleDelete = () => {
    if (confirmDelete) {
      onDelete();
    } else {
      setConfirmDelete(true);
    }
  };

  return (
    <aside className="w-80 flex-shrink-0 bg-white border-l border-gray-200 flex flex-col h-full overflow-y-auto shadow-lg">
      {/* Panel Header */}
      <div className="px-5 py-4 border-b border-gray-100 flex items-start justify-between">
        <div className="flex-1 min-w-0 pr-3">
          <h2 className="font-semibold text-gray-900 text-base leading-snug truncate">{job.title}</h2>
          <p className="text-sm text-gray-500 mt-0.5">{job.company}</p>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none flex-shrink-0 mt-0.5">
          &times;
        </button>
      </div>

      {/* Status Badge */}
      <div className="px-5 py-3 border-b border-gray-100">
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[job.status] || 'bg-gray-100 text-gray-600'}`}>
          {job.status}
        </span>
      </div>

      {/* Details */}
      <div className="px-5 py-4 flex-1 space-y-4">
        <Detail label="Applied Date" value={job.applied_date} />
        <Detail label="Location" value={job.location} />
        <Detail label="Salary Range" value={job.salary_range} />
        {job.job_url && (
          <div>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">Job URL</p>
            <a
              href={job.job_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline break-all"
            >
              {job.job_url}
            </a>
          </div>
        )}
        {job.notes && (
          <div>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">Notes</p>
            <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{job.notes}</p>
          </div>
        )}
        {job.updated_at && (
          <p className="text-xs text-gray-400 pt-2">
            Last updated {new Date(job.updated_at).toLocaleDateString()}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="px-5 py-4 border-t border-gray-100 space-y-2">
        <button
          onClick={onEdit}
          className="w-full px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
        >
          Edit
        </button>
        {confirmDelete ? (
          <div className="flex gap-2">
            <button
              onClick={() => setConfirmDelete(false)}
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="flex-1 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors"
            >
              Confirm Delete
            </button>
          </div>
        ) : (
          <button
            onClick={handleDelete}
            className="w-full px-4 py-2 rounded-lg border border-red-300 text-red-600 hover:bg-red-50 text-sm font-medium transition-colors"
          >
            Delete
          </button>
        )}
      </div>
    </aside>
  );
}

function Detail({ label, value }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">{label}</p>
      <p className="text-sm text-gray-800">{value}</p>
    </div>
  );
}
