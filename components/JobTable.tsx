import type { Job } from '@/types';

const STATUS_STYLES: Record<string, string> = {
  Applied:      'bg-blue-100 text-blue-700',
  Interviewing: 'bg-yellow-100 text-yellow-700',
  Offer:        'bg-green-100 text-green-700',
  Rejected:     'bg-red-100 text-red-700',
  Accepted:     'bg-emerald-100 text-emerald-700',
  Withdrawn:    'bg-gray-100 text-gray-600',
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[status] ?? 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  );
}

interface Props {
  jobs: Job[];
  selectedJobId?: number;
  onSelectJob: (job: Job) => void;
}

export default function JobTable({ jobs, selectedJobId, onSelectJob }: Props) {
  if (jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-400">
        <svg className="w-12 h-12 mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p className="text-sm">No jobs yet. Click <strong>+ Add Job</strong> to get started.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="text-left px-5 py-3 font-semibold text-gray-600">Job Title</th>
            <th className="text-left px-5 py-3 font-semibold text-gray-600">Company</th>
            <th className="text-left px-5 py-3 font-semibold text-gray-600">Location</th>
            <th className="text-left px-5 py-3 font-semibold text-gray-600">Applied</th>
            <th className="text-left px-5 py-3 font-semibold text-gray-600">Status</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job, i) => (
            <tr
              key={job.id}
              onClick={() => onSelectJob(job)}
              className={`border-b border-gray-100 cursor-pointer transition-colors last:border-0
                ${selectedJobId === job.id
                  ? 'bg-blue-50 hover:bg-blue-50'
                  : i % 2 === 0 ? 'bg-white hover:bg-gray-50' : 'bg-gray-50/50 hover:bg-gray-100/60'
                }`}
            >
              <td className="px-5 py-3.5 font-medium text-gray-900">{job.title}</td>
              <td className="px-5 py-3.5 text-gray-700">{job.company}</td>
              <td className="px-5 py-3.5 text-gray-500">{job.location ?? '—'}</td>
              <td className="px-5 py-3.5 text-gray-500">{job.applied_date}</td>
              <td className="px-5 py-3.5"><StatusBadge status={job.status} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
