'use client';

import React, { useState, useEffect } from 'react';
import { Job, STATUSES, STATUS_ICONS, RESUMES, SOURCES } from './data';
import { PixelButton, PixelIcon, PixelCheck, StatusPill, Stars, Tag, ImgSprite, fmtDateFull } from './pixel-ui';

// ── JobDetail ─────────────────────────────────────────────────────────────────
interface JobDetailProps {
  job: Job;
  onClose?: () => void;
  onEdit?: (j: Job) => void;
  onDelete?: (id: string) => void;
  onUpdate: (j: Job) => void;
  compact?: boolean;
}

export function JobDetail({ job, onClose, onEdit, onDelete, onUpdate, compact = false }: JobDetailProps) {
  const [tab, setTab] = useState('overview');

  const toggleChecklist = (pid: string) => {
    const next = job.prepChecklist.map(p => p.id === pid ? { ...p, done: !p.done } : p);
    onUpdate({ ...job, prepChecklist: next });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
      <div style={{ padding: '18px 22px', borderBottom: '3px solid var(--border-dark)', background: 'var(--surface-2)', flexShrink: 0 }}>
        <div className="row" style={{ justifyContent: 'space-between', marginBottom: 10 }}>
          <StatusPill statusId={job.status} />
          <div className="row" style={{ gap: 6 }}>
            {onEdit && <PixelButton variant="ghost" size="sm" icon="edit" onClick={() => onEdit(job)}>Edit</PixelButton>}
            {onDelete && <PixelButton variant="ghost" size="sm" icon="trash" onClick={() => onDelete(job.id)}>Delete</PixelButton>}
            {onClose && <PixelButton variant="ghost" size="icon" icon="x" onClick={onClose} title="Close" />}
          </div>
        </div>
        <h2 className="h-display" style={{ fontSize: compact ? 18 : 22 }}>{job.company}</h2>
        <div className="t-dim" style={{ marginTop: 4, fontSize: 18 }}>{job.role}</div>
        <div className="row" style={{ gap: 16, marginTop: 8, flexWrap: 'wrap' }}>
          {job.location && <span className="t-faint" style={{ fontSize: 14 }}>📍 {job.location}</span>}
          {job.salary && <span className="t-faint t-mono" style={{ fontSize: 14 }}>💰 {job.salary}</span>}
          <span className="t-faint" style={{ fontSize: 14 }}>📅 applied {fmtDateFull(job.appliedAt)}</span>
          {job.link && (
            <a href={job.link} target="_blank" rel="noopener noreferrer"
               style={{ color: 'var(--accent)', fontSize: 14, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <PixelIcon name="ext" size={12} /> job posting
            </a>
          )}
        </div>
        {job.tags?.length > 0 && (
          <div className="row" style={{ gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
            {job.tags.map(t => <Tag key={t}>{t}</Tag>)}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: 0, background: 'var(--surface-3)', borderBottom: '2px solid var(--border-dark)', padding: '0 12px' }}>
        {[['overview','Overview'],['timeline','Timeline'],['notes','Notes'],['prep','Prep'],['files','Files']].map(([id, label]) => (
          <button
            key={id}
            className={`px-tab${tab === id ? ' active' : ''}`}
            style={{ margin: '6px 0 0', padding: '8px 14px 6px' }}
            onClick={() => setTab(id)}
          >
            <span style={{ opacity: tab === id ? 1 : .6, fontWeight: tab === id ? 700 : 400 }}>{label}</span>
          </button>
        ))}
      </div>

      <div className="px-scroll" style={{ padding: '20px 22px', flex: 1 }}>
        {tab === 'overview'  && <Overview job={job} />}
        {tab === 'timeline'  && <Timeline job={job} />}
        {tab === 'notes'     && <Notes job={job} onUpdate={onUpdate} />}
        {tab === 'prep'      && <Prep job={job} onToggle={toggleChecklist} />}
        {tab === 'files'     && <Files job={job} />}
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="col" style={{ gap: 8 }}>
      <span className="h-label">{title}</span>
      <div>{children}</div>
    </div>
  );
}

function Overview({ job }: { job: Job }) {
  return (
    <div className="col" style={{ gap: 20 }}>
      <Section title="Job Description">
        <p style={{ margin: 0, lineHeight: 1.5 }}>{job.description}</p>
      </Section>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
        <Section title="Compensation"><div className="t-mono" style={{ fontSize: 20 }}>{job.salary || '—'}</div></Section>
        <Section title="Resume Used"><div className="t-mono">{job.resume || '—'}</div></Section>
        <Section title="Priority"><Stars value={job.priority || 0} /></Section>
        <Section title="Source"><span>{job.source || '—'}</span></Section>
      </div>
      {job.contacts?.length > 0 && (
        <Section title="Contacts">
          <div className="col" style={{ gap: 8 }}>
            {job.contacts.map((c, i) => (
              <div key={i} className="px-inset" style={{ padding: 10, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{c.name}</div>
                  <div className="t-dim" style={{ fontSize: 14 }}>{c.role}</div>
                </div>
                {c.email && <a href={`mailto:${c.email}`} className="t-mono" style={{ color: 'var(--accent)', textDecoration: 'none' }}>{c.email}</a>}
              </div>
            ))}
          </div>
        </Section>
      )}
      {(job.pros?.length > 0 || job.cons?.length > 0) && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Section title="Pros">
            <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.7 }}>
              {(job.pros || []).map((p, i) => <li key={i}>{p}</li>)}
              {(job.pros || []).length === 0 && <li className="t-faint">—</li>}
            </ul>
          </Section>
          <Section title="Cons">
            <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.7 }}>
              {(job.cons || []).map((c, i) => <li key={i}>{c}</li>)}
              {(job.cons || []).length === 0 && <li className="t-faint">—</li>}
            </ul>
          </Section>
        </div>
      )}
    </div>
  );
}

function Timeline({ job }: { job: Job }) {
  if (!job.timeline?.length) return <div className="empty">No activity yet.</div>;
  const sorted = [...job.timeline].sort((a, b) => b.date.localeCompare(a.date));
  return (
    <div className="tl">
      {sorted.map((ev, i) => {
        const s = STATUSES.find(x => x.id === ev.kind) || { color: '#888', icon: '·', label: ev.kind };
        const iconSrc = STATUS_ICONS[ev.kind];
        return (
          <div key={i} className="tl-row">
            <span className="tl-dot" style={{ '--dot-color': s.color } as React.CSSProperties}>
              {iconSrc ? <ImgSprite src={iconSrc} size={22} /> : <span style={{ fontSize: 14 }}>{s.icon}</span>}
            </span>
            <div>
              <div className="row" style={{ gap: 10, marginBottom: 4 }}>
                <span className="h-title" style={{ fontSize: 12 }}>{s.label}</span>
                <span className="t-faint t-mono" style={{ fontSize: 14 }}>{fmtDateFull(ev.date)}</span>
              </div>
              {ev.note && <div style={{ lineHeight: 1.5 }}>{ev.note}</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Notes({ job, onUpdate }: { job: Job; onUpdate: (j: Job) => void }) {
  const [val, setVal] = useState(job.notes || '');
  useEffect(() => { setVal(job.notes || ''); }, [job.id]);
  return (
    <div className="col" style={{ gap: 8 }}>
      <span className="h-label">Notes (autosaves on blur)</span>
      <textarea
        className="px-input"
        style={{ minHeight: 240, fontFamily: 'var(--font-mono)', fontSize: 16, lineHeight: 1.5, resize: 'vertical' }}
        value={val}
        onChange={e => setVal(e.target.value)}
        onBlur={() => onUpdate({ ...job, notes: val })}
        placeholder="Take notes here..."
      />
      <div className="t-faint" style={{ fontSize: 12 }}>{val.length} chars</div>
    </div>
  );
}

function Prep({ job, onToggle }: { job: Job; onToggle: (pid: string) => void }) {
  const list = job.prepChecklist || [];
  const done = list.filter(p => p.done).length;
  return (
    <div className="col" style={{ gap: 14 }}>
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <span className="h-title">Interview Prep</span>
        <span className="t-mono t-dim">{done}/{list.length} complete</span>
      </div>
      {list.length === 0 && <div className="empty">No prep items yet.</div>}
      <div className="col" style={{ gap: 6 }}>
        {list.map(p => (
          <div key={p.id} className="px-inset"
            style={{ padding: 10, display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', opacity: p.done ? .55 : 1 }}
            onClick={() => onToggle(p.id)}>
            <PixelCheck checked={p.done} onClick={() => onToggle(p.id)} />
            <span style={{ textDecoration: p.done ? 'line-through' : 'none' }}>{p.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Files({ job }: { job: Job }) {
  const files = job.attachments || [];
  if (files.length === 0) return <div className="empty">No attachments.</div>;
  return (
    <div className="col" style={{ gap: 8 }}>
      {files.map((f, i) => (
        <div key={i} className="px-inset" style={{ padding: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 32, height: 32, background: 'var(--surface)', border: '2px solid var(--border-dark)', display: 'grid', placeItems: 'center', fontSize: 18 }}>📄</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis' }}>{f.name}</div>
            <div className="t-faint t-mono" style={{ fontSize: 13 }}>{f.size} · {f.kind}</div>
          </div>
          <PixelButton variant="ghost" size="sm">Download</PixelButton>
        </div>
      ))}
    </div>
  );
}

// ── Detail wrappers ───────────────────────────────────────────────────────────
export function DetailDrawer({ job, ...rest }: JobDetailProps) {
  if (!job) return null;
  return (
    <>
      <div className="px-overlay" onClick={rest.onClose} style={{ background: 'rgba(0,0,0,.35)' }} />
      <div className="px-drawer"><JobDetail job={job} {...rest} /></div>
    </>
  );
}

export function DetailModal({ job, ...rest }: JobDetailProps) {
  if (!job) return null;
  return (
    <div className="px-overlay" onClick={rest.onClose}>
      <div className="px-modal" onClick={e => e.stopPropagation()}
           style={{ width: 'min(900px, calc(100% - 48px))', height: 'min(720px, calc(100% - 48px))' }}>
        <JobDetail job={job} {...rest} />
      </div>
    </div>
  );
}

export function DetailInline({ job, ...rest }: JobDetailProps) {
  if (!job) return null;
  return <div className="inline-detail"><JobDetail job={job} {...rest} compact /></div>;
}

// ── AddJobModal ───────────────────────────────────────────────────────────────
type FormState = Omit<Job, 'id'> & { id?: string };

interface AddJobModalProps {
  initial?: Job | null;
  onClose: () => void;
  onSave: (j: Job) => void;
}

export function AddJobModal({ initial, onClose, onSave }: AddJobModalProps) {
  const blank: FormState = {
    company: '', role: '', location: '', salary: '',
    status: 'applied', source: 'LinkedIn',
    resume: RESUMES[0], priority: 3,
    appliedAt: '2026-05-21',
    tags: [], link: '', notes: '', description: '',
    contacts: [], timeline: [], prepChecklist: [],
    pros: [], cons: [], attachments: [],
  };
  const [form, setForm] = useState<FormState>(initial || blank);
  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => setForm(f => ({ ...f, [k]: v }));

  const submit = () => {
    if (!form.company.trim()) return;
    const job: Job = { ...form, id: form.id || 'j' + Date.now() };
    if (!form.id) job.timeline = [{ date: job.appliedAt, kind: job.status, note: 'Created entry.' }];
    onSave(job);
  };

  return (
    <div className="px-overlay" onClick={onClose}>
      <div className="px-modal" onClick={e => e.stopPropagation()}>
        <div style={{ padding: '18px 22px', borderBottom: '3px solid var(--border-dark)', background: 'var(--surface-2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 className="h-display" style={{ fontSize: 18 }}>{initial ? 'Edit Quest' : 'Add New Quest'}</h2>
          <PixelButton variant="ghost" size="icon" icon="x" onClick={onClose} />
        </div>
        <div className="px-scroll" style={{ padding: 22, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <Field label="Company *" style={{ gridColumn: '1 / -1' }}>
            <input className="px-input" value={form.company} onChange={e => set('company', e.target.value)} placeholder="e.g. Mossvale Studios" autoFocus />
          </Field>
          <Field label="Role">
            <input className="px-input" value={form.role} onChange={e => set('role', e.target.value)} placeholder="e.g. Senior Engineer" />
          </Field>
          <Field label="Location">
            <input className="px-input" value={form.location || ''} onChange={e => set('location', e.target.value)} placeholder="Remote · US" />
          </Field>
          <Field label="Salary range">
            <input className="px-input" value={form.salary || ''} onChange={e => set('salary', e.target.value)} placeholder="$150k – $180k" />
          </Field>
          <Field label="Date applied">
            <input className="px-input" type="date" value={form.appliedAt} onChange={e => set('appliedAt', e.target.value)} />
          </Field>
          <Field label="Status">
            <select className="px-input" value={form.status} onChange={e => set('status', e.target.value)}>
              {STATUSES.map(s => <option key={s.id} value={s.id}>{s.icon} {s.label}</option>)}
            </select>
          </Field>
          <Field label="Source">
            <select className="px-input" value={form.source} onChange={e => set('source', e.target.value)}>
              {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="Resume version">
            <select className="px-input" value={form.resume} onChange={e => set('resume', e.target.value)}>
              {RESUMES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </Field>
          <Field label="Priority">
            <div style={{ padding: '8px 4px' }}>
              <Stars value={form.priority} onChange={v => set('priority', v)} />
            </div>
          </Field>
          <Field label="Job posting URL" style={{ gridColumn: '1 / -1' }}>
            <input className="px-input" value={form.link || ''} onChange={e => set('link', e.target.value)} placeholder="https://..." />
          </Field>
          <Field label="Tags (comma-separated)" style={{ gridColumn: '1 / -1' }}>
            <input
              className="px-input"
              value={(form.tags || []).join(', ')}
              onChange={e => set('tags', e.target.value.split(',').map(t => t.trim()).filter(Boolean))}
              placeholder="remote, react, series-b"
            />
          </Field>
          <Field label="Job description" style={{ gridColumn: '1 / -1' }}>
            <textarea className="px-input" rows={4} value={form.description} onChange={e => set('description', e.target.value)} style={{ resize: 'vertical', fontFamily: 'var(--font-body)' }} />
          </Field>
          <Field label="Notes" style={{ gridColumn: '1 / -1' }}>
            <textarea className="px-input" rows={3} value={form.notes} onChange={e => set('notes', e.target.value)} style={{ resize: 'vertical', fontFamily: 'var(--font-mono)' }} />
          </Field>
        </div>
        <div style={{ padding: '14px 22px', borderTop: '3px solid var(--border-dark)', background: 'var(--surface-2)', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <PixelButton onClick={onClose}>Cancel</PixelButton>
          <PixelButton variant="primary" icon="check" onClick={submit}>{initial ? 'Save Changes' : 'Add Quest'}</PixelButton>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children, style }: { label: string; children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div className="col" style={{ gap: 4, ...(style || {}) }}>
      <span className="h-label">{label}</span>
      {children}
    </div>
  );
}
