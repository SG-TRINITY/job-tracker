'use client';

import { useState, useEffect } from 'react';
import type { Job, JobFormData } from '@/types';

const STATUSES = ['Applied', 'Interviewing', 'Offer', 'Rejected', 'Accepted', 'Withdrawn'];

const EMPTY: JobFormData = {
  title: '', company: '', applied_date: '', status: 'Applied',
  location: null, salary_range: null, job_url: null, notes: null,
};

interface Props {
  job: Job | null;
  onSubmit: (data: JobFormData) => Promise<void>;
  onClose: () => void;
}

export default function AddJobModal({ job, onSubmit, onClose }: Props) {
  const [form, setForm] = useState<JobFormData>(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof JobFormData, string>>>({});

  useEffect(() => {
    if (job) {
      setForm({
        title: job.title,
        company: job.company,
        applied_date: job.applied_date,
        status: job.status,
        location: job.location,
        salary_range: job.salary_range,
        job_url: job.job_url,
        notes: job.notes,
      });
    } else {
      setForm({ ...EMPTY, applied_date: new Date().toISOString().split('T')[0] });
    }
  }, [job]);

  const set = (field: keyof JobFormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value || null }));

  const validate = () => {
    const e: Partial<Record<keyof JobFormData, string>> = {};
    if (!form.title?.trim()) e.title = 'Required';
    if (!form.company?.trim()) e.company = 'Required';
    if (!form.applied_date) e.applied_date = 'Required';
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitting(true);
    try {
      await onSubmit(form);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-lg font-semibold text-gray-900">{job ? 'Edit Job' : 'Add New Job'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Job Title *" error={errors.title}>
              <input value={form.title ?? ''} onChange={set('title')} placeholder="e.g. Software Engineer"
                className={inputCls(errors.title)} />
            </Field>
            <Field label="Company *" error={errors.company}>
              <input value={form.company ?? ''} onChange={set('company')} placeholder="e.g. Acme Corp"
                className={inputCls(errors.company)} />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Applied Date *" error={errors.applied_date}>
              <input type="date" value={form.applied_date ?? ''} onChange={set('applied_date')}
                className={inputCls(errors.applied_date)} />
            </Field>
            <Field label="Status">
              <select value={form.status ?? 'Applied'} onChange={set('status')} className={inputCls()}>
                {STATUSES.map(s => <option key={s}>{s}</option>)}
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Location">
              <input value={form.location ?? ''} onChange={set('location')} placeholder="e.g. Remote, NYC"
                className={inputCls()} />
            </Field>
            <Field label="Salary Range">
              <input value={form.salary_range ?? ''} onChange={set('salary_range')} placeholder="e.g. $80k–$100k"
                className={inputCls()} />
            </Field>
          </div>

          <Field label="Job URL">
            <input value={form.job_url ?? ''} onChange={set('job_url')} placeholder="https://..."
              type="url" className={inputCls()} />
          </Field>

          <Field label="Notes">
            <textarea value={form.notes ?? ''} onChange={set('notes')} rows={3}
              placeholder="Recruiter name, interview rounds, anything relevant..."
              className={inputCls() + ' resize-none'} />
          </Field>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium text-sm hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={submitting}
              className="flex-1 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-medium text-sm transition-colors">
              {submitting ? 'Saving...' : job ? 'Update Job' : 'Add Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

function inputCls(error?: string) {
  return `w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
    error ? 'border-red-400' : 'border-gray-300'
  }`;
}
