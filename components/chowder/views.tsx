'use client';

import React, { useState } from 'react';
import { Job, STATUSES, STATUS_ICONS } from './data';
import { PixelButton, PixelIcon, PixelCheck, StatusPill, Stars, ImgSprite, fmtDate, daysAgo } from './pixel-ui';

// ── Shared sort helper ────────────────────────────────────────────────────────
function ymd(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

// ── TableView ─────────────────────────────────────────────────────────────────
interface SortState { key: string; dir: 'asc' | 'desc'; }

interface TableViewProps {
  jobs: Job[];
  columns: Record<string, boolean>;
  sort: SortState;
  setSort: (s: SortState) => void;
  expandedId: string | null;
  setExpandedId: (id: string | null) => void;
  selectedIds: Set<string>;
  setSelectedIds: (s: Set<string>) => void;
  expandedStyle: string;
  onEditJob: (j: Job) => void;
  onDeleteJob: (id: string) => void;
  inlineRenderer: (j: Job) => React.ReactNode;
}

export function TableView({
  jobs, columns, sort, setSort, expandedId, setExpandedId,
  selectedIds, setSelectedIds, expandedStyle, onEditJob, onDeleteJob, inlineRenderer,
}: TableViewProps) {
  const allChecked = jobs.length > 0 && jobs.every(j => selectedIds.has(j.id));

  const toggleAll = () => {
    if (allChecked) setSelectedIds(new Set());
    else setSelectedIds(new Set(jobs.map(j => j.id)));
  };
  const toggleOne = (id: string) => {
    const next = new Set(selectedIds);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelectedIds(next);
  };
  const onHeader = (key: string) => {
    if (sort.key === key) setSort({ key, dir: sort.dir === 'asc' ? 'desc' : 'asc' });
    else setSort({ key, dir: 'asc' });
  };

  const colDefs: Record<string, { label: string; width: string }> = {
    company:   { label: 'Company',  width: '20%' },
    role:      { label: 'Role',     width: '24%' },
    appliedAt: { label: 'Applied',  width: '120px' },
    status:    { label: 'Status',   width: '140px' },
    source:    { label: 'Source',   width: '120px' },
    resume:    { label: 'Resume',   width: '160px' },
  };
  const visibleCols = Object.keys(colDefs).filter(k => columns[k]);

  return (
    <div className="px-panel" style={{ padding: 0, overflow: 'hidden' }}>
      <div className="px-scroll" style={{ maxHeight: 'calc(100vh - 220px)' }}>
        <table className="px-table">
          <thead>
            <tr>
              <th style={{ width: 38, cursor: 'default' }} onClick={e => e.stopPropagation()}>
                <PixelCheck checked={allChecked} onClick={toggleAll} />
              </th>
              {visibleCols.map(k => (
                <th key={k} style={{ width: colDefs[k].width }} onClick={() => onHeader(k)}>
                  {colDefs[k].label}
                  {sort.key === k && <span className="sort-caret">{sort.dir === 'asc' ? '▲' : '▼'}</span>}
                </th>
              ))}
              <th style={{ width: 80, textAlign: 'right' }}>·</th>
            </tr>
          </thead>
          <tbody>
            {jobs.length === 0 && (
              <tr><td colSpan={visibleCols.length + 2}>
                <div className="empty">No jobs match your filters. Try clearing them.</div>
              </td></tr>
            )}
            {jobs.map(job => {
              const isExpanded = expandedStyle === 'inline' && expandedId === job.id;
              const isSelected = selectedIds.has(job.id);
              return (
                <React.Fragment key={job.id}>
                  <tr
                    className={[isExpanded ? 'expanded' : '', isSelected ? 'selected' : ''].join(' ')}
                    onClick={() => setExpandedId(isExpanded ? null : job.id)}
                  >
                    <td onClick={e => e.stopPropagation()}>
                      <PixelCheck checked={isSelected} onClick={() => toggleOne(job.id)} />
                    </td>
                    {visibleCols.map(k => <td key={k}>{renderCell(job, k)}</td>)}
                    <td style={{ textAlign: 'right' }} onClick={e => e.stopPropagation()}>
                      <PixelButton variant="ghost" size="icon" icon="edit" onClick={() => onEditJob(job)} title="Edit" />
                      <PixelButton variant="ghost" size="icon" icon="trash" onClick={() => onDeleteJob(job.id)} title="Delete" />
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr>
                      <td colSpan={visibleCols.length + 2} style={{ padding: 0 }}>
                        {inlineRenderer(job)}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function renderCell(job: Job, key: string) {
  switch (key) {
    case 'company':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ fontWeight: 600 }}>{job.company}</span>
          {job.location && <span className="t-faint" style={{ fontSize: 14 }}>{job.location}</span>}
        </div>
      );
    case 'role':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span>{job.role}</span>
          {job.salary && <span className="t-faint t-mono" style={{ fontSize: 14 }}>{job.salary}</span>}
        </div>
      );
    case 'appliedAt':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span className="t-mono">{fmtDate(job.appliedAt)}</span>
          <span className="t-faint" style={{ fontSize: 12 }}>{daysAgo(job.appliedAt)}</span>
        </div>
      );
    case 'status':   return <StatusPill statusId={job.status} />;
    case 'source':   return <span className="t-dim">{job.source}</span>;
    case 'resume':   return <span className="t-dim t-mono" style={{ fontSize: 14 }}>{job.resume}</span>;
    default: return null;
  }
}

// ── KanbanView ────────────────────────────────────────────────────────────────
interface KanbanViewProps {
  jobs: Job[];
  onOpenJob: (id: string) => void;
  onStatusChange: (id: string, status: string) => void;
}

export function KanbanView({ jobs, onOpenJob, onStatusChange }: KanbanViewProps) {
  const [dragId, setDragId] = useState<string | null>(null);
  const [overCol, setOverCol] = useState<string | null>(null);

  const onDragStart = (id: string) => (e: React.DragEvent) => {
    setDragId(id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id);
  };
  const onDragEnd = () => { setDragId(null); setOverCol(null); };
  const onDragOver = (colId: string) => (e: React.DragEvent) => { e.preventDefault(); setOverCol(colId); };
  const onDrop = (colId: string) => (e: React.DragEvent) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain') || dragId;
    if (id) onStatusChange(id, colId);
    setDragId(null); setOverCol(null);
  };

  return (
    <div style={{ overflowX: 'auto', padding: '0 4px 4px' }}>
      <div className="kanban" style={{ '--cols': STATUSES.length } as React.CSSProperties}>
        {STATUSES.map(col => {
          const colJobs = jobs.filter(j => j.status === col.id);
          const iconSrc = STATUS_ICONS[col.id];
          return (
            <div key={col.id} className="kanban-col">
              <header>
                <div className="row" style={{ gap: 8 }}>
                  {iconSrc ? <ImgSprite src={iconSrc} size={20} /> : <span style={{ fontSize: 18 }}>{col.icon}</span>}
                  <span className="h-title" style={{ color: 'var(--ink)' }}>{col.label}</span>
                </div>
                <span className="px-tag">{colJobs.length}</span>
              </header>
              <div
                className={`kanban-col-body${overCol === col.id ? ' drag-over' : ''}`}
                onDragOver={onDragOver(col.id)}
                onDragLeave={() => setOverCol(o => o === col.id ? null : o)}
                onDrop={onDrop(col.id)}
              >
                {colJobs.length === 0 && <div className="empty" style={{ padding: 14, fontSize: 10 }}>— empty —</div>}
                {colJobs.map(j => (
                  <div
                    key={j.id}
                    className={`kanban-card${dragId === j.id ? ' dragging' : ''}`}
                    draggable
                    onDragStart={onDragStart(j.id)}
                    onDragEnd={onDragEnd}
                    onClick={() => onOpenJob(j.id)}
                  >
                    <div style={{ fontWeight: 600, marginBottom: 4 }}>{j.company}</div>
                    <div className="t-dim" style={{ fontSize: 14, marginBottom: 6 }}>{j.role}</div>
                    <div className="row" style={{ justifyContent: 'space-between', fontSize: 12 }}>
                      <Stars value={j.priority || 0} />
                      <span className="t-faint t-mono">{daysAgo(j.appliedAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── CalendarView ──────────────────────────────────────────────────────────────
interface CalendarViewProps { jobs: Job[]; onOpenJob: (id: string) => void; }

export function CalendarView({ jobs, onOpenJob }: CalendarViewProps) {
  const [cursor, setCursor] = useState(new Date('2026-05-01T12:00:00'));
  const today = new Date('2026-05-21T12:00:00');
  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const monthStart = new Date(year, month, 1);
  const startWeekday = monthStart.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = cursor.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const events: Record<string, Array<{ job: Job; kind: string; note: string }>> = {};
  jobs.forEach(j => {
    j.timeline?.forEach(t => {
      if (!events[t.date]) events[t.date] = [];
      events[t.date].push({ job: j, kind: t.kind, note: t.note });
    });
  });

  const cells: Array<{ day: number; date: string; dim: boolean }> = [];
  for (let i = 0; i < startWeekday; i++) {
    const d = new Date(year, month, -startWeekday + i + 1);
    cells.push({ day: d.getDate(), date: ymd(d), dim: true });
  }
  for (let i = 1; i <= daysInMonth; i++) {
    const d = new Date(year, month, i);
    cells.push({ day: i, date: ymd(d), dim: false });
  }
  while (cells.length % 7 !== 0) {
    const d = new Date(year, month, daysInMonth + (cells.length - daysInMonth - startWeekday) + 1);
    cells.push({ day: d.getDate(), date: ymd(d), dim: true });
  }

  return (
    <div className="px-panel" style={{ padding: 16 }}>
      <div className="row" style={{ justifyContent: 'space-between', marginBottom: 14 }}>
        <h2 className="h-display" style={{ fontSize: 18 }}>{monthName}</h2>
        <div className="row" style={{ gap: 8 }}>
          <PixelButton variant="default" size="sm" icon="chevron_l" onClick={() => setCursor(new Date(year, month - 1, 1))}>Prev</PixelButton>
          <PixelButton variant="default" size="sm" onClick={() => setCursor(new Date(today))}>Today</PixelButton>
          <PixelButton variant="default" size="sm" icon="chevron_r" onClick={() => setCursor(new Date(year, month + 1, 1))}>Next</PixelButton>
        </div>
      </div>
      <div className="cal-grid" style={{ marginBottom: 4 }}>
        {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
          <div key={d} className="h-label" style={{ textAlign: 'center', padding: '4px 0' }}>{d}</div>
        ))}
      </div>
      <div className="cal-grid">
        {cells.map((c, i) => {
          const isToday = c.date === ymd(today);
          const dayEvents = events[c.date] || [];
          return (
            <div key={i} className={`cal-cell${c.dim ? ' dim' : ''}${isToday ? ' today' : ''}`}>
              <span className="cal-day-num">{c.day}</span>
              {dayEvents.slice(0, 3).map((ev, idx) => {
                const s = STATUSES.find(x => x.id === ev.kind) || { color: '#888', icon: '·' };
                const iconSrc = STATUS_ICONS[ev.kind];
                return (
                  <div
                    key={idx}
                    className="cal-event"
                    style={{ '--event-bg': s.color } as React.CSSProperties}
                    onClick={() => onOpenJob(ev.job.id)}
                    title={`${ev.job.company} — ${ev.note}`}
                  >
                    {iconSrc ? <ImgSprite src={iconSrc} size={14} /> : <span>{s.icon}</span>}
                    <span>{ev.job.company}</span>
                  </div>
                );
              })}
              {dayEvents.length > 3 && <span className="t-faint" style={{ fontSize: 12 }}>+{dayEvents.length - 3} more</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── StatsView ─────────────────────────────────────────────────────────────────
interface StatsViewProps { jobs: Job[]; }

export function StatsView({ jobs }: StatsViewProps) {
  const total = jobs.length;
  const byStatus = STATUSES.map(s => ({ ...s, count: jobs.filter(j => j.status === s.id).length }));
  const active = byStatus.filter(s => !['rejected', 'ghosted'].includes(s.id)).reduce((sum, s) => sum + s.count, 0);
  const offers = byStatus.find(s => s.id === 'offer')?.count || 0;
  const interviews = byStatus.find(s => s.id === 'interview')?.count || 0;
  const rejected = byStatus.find(s => s.id === 'rejected')?.count || 0;
  const appliedCount = byStatus.find(s => s.id === 'applied')?.count || 0;
  const wishlistCount = byStatus.find(s => s.id === 'wishlist')?.count || 0;
  const responseRate = total ? Math.round((total - appliedCount - wishlistCount) / total * 100) : 0;
  const maxCount = Math.max(1, ...byStatus.map(s => s.count));

  const bySource: Record<string, number> = {};
  jobs.forEach(j => { bySource[j.source] = (bySource[j.source] || 0) + 1; });
  const sourceRows = Object.entries(bySource).sort((a, b) => b[1] - a[1]);
  const maxSrc = Math.max(1, ...sourceRows.map(([, n]) => n));

  const now = new Date('2026-05-21T12:00:00');
  const weeks = Array.from({ length: 8 }, (_, i) => {
    const start = new Date(now); start.setDate(now.getDate() - (7 - i) * 7);
    const end = new Date(now); end.setDate(now.getDate() - (7 - i) * 7 + 6);
    const count = jobs.filter(j => {
      const d = new Date(j.appliedAt + 'T12:00:00');
      return d >= start && d <= end;
    }).length;
    return { label: end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), count };
  });
  const maxWk = Math.max(1, ...weeks.map(w => w.count));

  return (
    <div className="col" style={{ gap: 20 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
        <div className="stat-card"><span className="stat-label">Total Quests</span><span className="stat-value">{total}</span></div>
        <div className="stat-card"><span className="stat-label">Active</span><span className="stat-value" style={{ color: 'var(--accent)' }}>{active}</span></div>
        <div className="stat-card">
          <span className="stat-label">Interviewing</span>
          <span className="stat-value" style={{ color: 'var(--accent-2)' }}>
            <ImgSprite src="/assets/icon-flame-sword.png" size={26} />{interviews}
          </span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Offers</span>
          <span className="stat-value" style={{ color: 'var(--good)' }}>
            <ImgSprite src="/assets/icon-chest.png" size={26} />{offers}
          </span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Rejected</span>
          <span className="stat-value" style={{ color: 'var(--danger)' }}>
            <ImgSprite src="/assets/icon-skull.png" size={26} />{rejected}
          </span>
        </div>
        <div className="stat-card"><span className="stat-label">Response Rate</span><span className="stat-value">{responseRate}%</span></div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 16 }}>
        <div className="px-panel" style={{ padding: 16 }}>
          <h3 className="h-title" style={{ marginBottom: 12 }}>By Status</h3>
          {byStatus.map(s => {
            const iconSrc = STATUS_ICONS[s.id];
            return (
              <div key={s.id} className="bar-row">
                <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
                  {iconSrc ? <ImgSprite src={iconSrc} size={18} /> : <span>{s.icon}</span>}
                  <span>{s.label}</span>
                </span>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: `${(s.count / maxCount) * 100}%`, '--bar-color': s.color } as React.CSSProperties} />
                </div>
                <span className="t-mono" style={{ textAlign: 'right' }}>{s.count}</span>
              </div>
            );
          })}
        </div>

        <div className="px-panel" style={{ padding: 16 }}>
          <h3 className="h-title" style={{ marginBottom: 12 }}>By Source</h3>
          {sourceRows.map(([src, n]) => (
            <div key={src} className="bar-row">
              <span style={{ fontSize: 14 }}>{src}</span>
              <div className="bar-track">
                <div className="bar-fill" style={{ width: `${(n / maxSrc) * 100}%`, '--bar-color': 'var(--accent-2)' } as React.CSSProperties} />
              </div>
              <span className="t-mono" style={{ textAlign: 'right' }}>{n}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="px-panel" style={{ padding: 16 }}>
        <h3 className="h-title" style={{ marginBottom: 12 }}>Applications · Last 8 Weeks</h3>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 160, paddingTop: 12 }}>
          {weeks.map((w, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <span className="t-mono" style={{ fontSize: 14 }}>{w.count || ''}</span>
              <div style={{
                width: '100%',
                height: `${(w.count / maxWk) * 100}%`,
                minHeight: w.count ? 6 : 2,
                background: 'var(--accent)',
                border: '2px solid var(--border-dark)',
                boxShadow: 'inset 1px 1px 0 rgba(255,255,255,.3), inset -1px -1px 0 rgba(0,0,0,.3)',
              }} />
              <span className="t-faint t-mono" style={{ fontSize: 12 }}>{w.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
