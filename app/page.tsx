'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { INITIAL_JOBS, STATUSES, SOURCES, STATUS_ICONS, Job } from '@/components/chowder/data';
import { CHARACTERS, SCENES } from '@/components/chowder/characters';
import { ImgSprite, PixelButton, PixelIcon, StatusPill } from '@/components/chowder/pixel-ui';
import { TableView, KanbanView, CalendarView, StatsView } from '@/components/chowder/views';
import { DetailDrawer, DetailModal, DetailInline, AddJobModal } from '@/components/chowder/details';
import { useTweaks, TweaksPanel, TweakSection, TweakSelect, TweakRadio, TweakToggle } from '@/components/chowder/tweaks-panel';

// ── Tweak defaults ────────────────────────────────────────────────────────────
const TWEAK_DEFAULTS = {
  theme:         'stardew',
  mode:          'light',
  scene:         'cozy-desk',
  character:     'elf-green',
  density:       'regular',
  expandedStyle: 'drawer',
  font:          'pixelify',
  accent:        'default',
  showCompany:   true,
  showRole:      true,
  showAppliedAt: true,
  showStatus:    true,
  showSource:    true,
  showResume:    true,
};

const ACCENT_PRESETS: Record<string, { accent: string; accent2: string } | null> = {
  default: null,
  emerald: { accent: '#3a8a4a', accent2: '#88c050' },
  rose:    { accent: '#d83870', accent2: '#f0a8c4' },
  azure:   { accent: '#3a6ab8', accent2: '#80b0e0' },
  amber:   { accent: '#d89020', accent2: '#f0c060' },
};

const FONT_STACKS: Record<string, { ui: string; body: string; display: string }> = {
  pixelify: { ui: "'Silkscreen','Press Start 2P',monospace", body: "'Pixelify Sans','Jersey 15',monospace", display: "'Press Start 2P',monospace" },
  retro:    { ui: "'VT323',monospace",                       body: "'VT323',monospace",                    display: "'Press Start 2P',monospace" },
  jersey:   { ui: "'Silkscreen',monospace",                  body: "'Jersey 15',monospace",                display: "'Press Start 2P',monospace" },
};

export default function ChowderApp() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [jobs, setJobs] = useState<Job[]>(INITIAL_JOBS);
  const [view, setView] = useState<'table' | 'board' | 'calendar' | 'stats'>('table');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [sort, setSort] = useState<{ key: string; dir: 'asc' | 'desc' }>({ key: 'appliedAt', dir: 'desc' });
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Apply theme/mode/density to <html>
  useEffect(() => {
    document.documentElement.dataset.theme = t.theme;
    document.documentElement.dataset.mode = t.mode;
    document.documentElement.dataset.density = t.density;
  }, [t.theme, t.mode, t.density]);

  // Apply accent preset
  useEffect(() => {
    const root = document.documentElement;
    const preset = ACCENT_PRESETS[t.accent];
    if (preset) {
      root.style.setProperty('--accent', preset.accent);
      root.style.setProperty('--accent-2', preset.accent2);
    } else {
      root.style.removeProperty('--accent');
      root.style.removeProperty('--accent-2');
    }
  }, [t.accent, t.theme, t.mode]);

  // Apply font stack
  useEffect(() => {
    const root = document.documentElement;
    const f = FONT_STACKS[t.font] || FONT_STACKS.pixelify;
    root.style.setProperty('--font-ui', f.ui);
    root.style.setProperty('--font-body', f.body);
    root.style.setProperty('--font-display', f.display);
  }, [t.font]);

  // Apply scene background
  useEffect(() => {
    const scene = SCENES.find(s => s.id === t.scene) || SCENES[0];
    document.body.style.backgroundImage = `url('${scene.image}')`;
    document.documentElement.style.setProperty('--scene-overlay', scene.overlay);
  }, [t.scene]);

  const character = useMemo(
    () => CHARACTERS.find(c => c.id === t.character) || CHARACTERS[0],
    [t.character]
  );

  // Filtering + sort
  const filtered = useMemo(() => {
    let out = jobs;
    if (statusFilter !== 'all') out = out.filter(j => j.status === statusFilter);
    if (sourceFilter !== 'all') out = out.filter(j => j.source === sourceFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      out = out.filter(j =>
        j.company.toLowerCase().includes(q) ||
        j.role.toLowerCase().includes(q) ||
        (j.tags || []).some(tag => tag.toLowerCase().includes(q))
      );
    }
    const dir = sort.dir === 'asc' ? 1 : -1;
    return [...out].sort((a, b) => {
      const av = (a as unknown as Record<string, unknown>)[sort.key] ?? '';
      const bv = (b as unknown as Record<string, unknown>)[sort.key] ?? '';
      if (av < bv) return -1 * dir;
      if (av > bv) return 1 * dir;
      return 0;
    });
  }, [jobs, statusFilter, sourceFilter, search, sort]);

  const updateJob = (job: Job) => setJobs(prev => prev.map(j => j.id === job.id ? job : j));
  const deleteJob = (id: string) => {
    if (!confirm('Delete this quest?')) return;
    setJobs(prev => prev.filter(j => j.id !== id));
    if (expandedId === id) setExpandedId(null);
    setSelectedIds(prev => { const n = new Set(prev); n.delete(id); return n; });
  };
  const addJob = (job: Job) => setJobs(prev => [job, ...prev]);
  const handleSaveJob = (job: Job) => {
    if (jobs.find(j => j.id === job.id)) updateJob(job);
    else addJob(job);
    setIsAdding(false); setEditingJob(null);
  };
  const onStatusChange = (id: string, newStatus: string) => {
    setJobs(prev => prev.map(j => {
      if (j.id !== id || j.status === newStatus) return j;
      const tl = [...(j.timeline || []), { date: '2026-05-21', kind: newStatus, note: `Moved to ${newStatus}.` }];
      return { ...j, status: newStatus, timeline: tl };
    }));
  };
  const bulkDelete = () => {
    if (!confirm(`Delete ${selectedIds.size} quest(s)?`)) return;
    setJobs(prev => prev.filter(j => !selectedIds.has(j.id)));
    setSelectedIds(new Set());
  };
  const bulkStatus = (s: string) => {
    if (!s) return;
    setJobs(prev => prev.map(j => selectedIds.has(j.id) ? { ...j, status: s } : j));
  };

  const expandedJob = jobs.find(j => j.id === expandedId) || null;

  const inlineRenderer = (job: Job) => (
    <DetailInline
      job={job} onClose={() => setExpandedId(null)}
      onEdit={j => setEditingJob(j)} onDelete={deleteJob} onUpdate={updateJob}
    />
  );

  // Sidebar stats
  const stats = useMemo(() => {
    const by: Record<string, number> = {};
    jobs.forEach(j => { by[j.status] = (by[j.status] || 0) + 1; });
    return {
      offers:     by.offer || 0,
      interviews: by.interview || 0,
      pending:    (by.applied || 0) + (by.screen || 0),
      total:      jobs.length,
    };
  }, [jobs]);
  const level = Math.min(99, Math.floor(jobs.length / 2) + 1);
  const xpPct = (jobs.length * 50) % 100;

  return (
    <div className="app">
      {/* ─── Sidebar ───────────────────────────────────────────────────────── */}
      <div className="sidebar">
        <div className="frame brand-bar">
          <span className="brand-mark">
            <ImgSprite src="/assets/icon-grimoire-red.png" size={28} />
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
            <h1>CHOWDER</h1>
            <span className="brand-sub">Quest Tracker · v1.0</span>
          </div>
        </div>

        <div className="frame char-card">
          <div className="char-portrait">
            <img src={character.image} alt={character.name} className="pixelated" />
          </div>
          <div style={{ paddingTop: 4 }}>
            <h3 className="char-name">{character.name}</h3>
            <div className="char-class">{character.class}</div>
            <div className="char-level">
              <span className="char-level-badge">LV {level}</span>
              <div className="xp-track">
                <div className="xp-fill" style={{ width: `${xpPct}%` }} />
              </div>
            </div>
          </div>
        </div>

        <div className="frame-thin" style={{ padding: 10 }}>
          <div className="mini-stats">
            <div className="mini-stat">
              <strong style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <ImgSprite src="/assets/icon-chest.png" size={18} />{stats.offers}
              </strong>
              <span>Offers</span>
            </div>
            <div className="mini-stat">
              <strong style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <ImgSprite src="/assets/icon-flame-sword.png" size={18} />{stats.interviews}
              </strong>
              <span>Duels</span>
            </div>
            <div className="mini-stat">
              <strong style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <ImgSprite src="/assets/icon-scroll.png" size={18} />{stats.pending}
              </strong>
              <span>In Limbo</span>
            </div>
            <div className="mini-stat">
              <strong style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <ImgSprite src="/assets/icon-crystal-heart.png" size={18} />{stats.total}
              </strong>
              <span>Total</span>
            </div>
          </div>
        </div>

        <div className="frame quote-card">
          <span style={{ paddingLeft: 12 }}>{character.quote}</span>
          <span className="quote-attr">— {character.name}</span>
        </div>
      </div>

      {/* ─── Workspace ─────────────────────────────────────────────────────── */}
      <div className="workspace">
        {/* Topbar */}
        <div className="frame-thin topbar">
          <div className="px-tabs">
            {([
              ['table',    'Table',    'table'],
              ['board',    'Board',    'grid'],
              ['calendar', 'Calendar', 'calendar'],
              ['stats',    'Stats',    'chart'],
            ] as const).map(([id, label, icon]) => (
              <button key={id} type="button"
                className={'px-tab' + (view === id ? ' active' : '')}
                onClick={() => setView(id as typeof view)}>
                <PixelIcon name={icon} size={11} />
                {label}
              </button>
            ))}
          </div>
          <div className="row" style={{ gap: 8 }}>
            <span className="h-label">{jobs.length} quests</span>
            <PixelButton variant="primary" icon="plus" onClick={() => setIsAdding(true)}>
              Add Quest
            </PixelButton>
          </div>
        </div>

        {/* Toolbar */}
        <div className="frame-thin toolbar">
          <div style={{ position: 'relative', width: 220 }}>
            <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', display: 'flex' }}>
              <PixelIcon name="search" size={14} color="var(--ink-faint)" />
            </span>
            <input
              className="px-input"
              style={{ paddingLeft: 32 }}
              placeholder="Search company, role, tag..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select className="px-input" title="Filter by status" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="all">All statuses</option>
            {STATUSES.map(s => <option key={s.id} value={s.id}>{s.icon} {s.label}</option>)}
          </select>
          <select className="px-input" title="Filter by source" value={sourceFilter} onChange={e => setSourceFilter(e.target.value)}>
            <option value="all">All sources</option>
            {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          {selectedIds.size > 0 && (
            <>
              <div style={{ height: 22, width: 2, background: 'var(--border-mid)' }} />
              <span className="h-label">{selectedIds.size} selected</span>
              <select className="px-input" title="Set status for selected" value="" onChange={e => bulkStatus(e.target.value)}>
                <option value="">Set status…</option>
                {STATUSES.map(s => <option key={s.id} value={s.id}>{s.icon} {s.label}</option>)}
              </select>
              <PixelButton variant="danger" size="sm" icon="trash" onClick={bulkDelete}>Delete</PixelButton>
              <PixelButton variant="ghost" size="sm" onClick={() => setSelectedIds(new Set())}>Clear</PixelButton>
            </>
          )}
        </div>

        {/* Main content */}
        <div className="frame main">
          {view === 'table' && (
            <TableView
              jobs={filtered}
              columns={{
                company: t.showCompany, role: t.showRole, appliedAt: t.showAppliedAt,
                status: t.showStatus, source: t.showSource, resume: t.showResume,
              }}
              sort={sort} setSort={setSort}
              expandedId={expandedId} setExpandedId={setExpandedId}
              selectedIds={selectedIds} setSelectedIds={setSelectedIds}
              expandedStyle={t.expandedStyle}
              onEditJob={j => setEditingJob(j)}
              onDeleteJob={deleteJob}
              inlineRenderer={inlineRenderer}
            />
          )}
          {view === 'board' && (
            <KanbanView jobs={filtered} onOpenJob={setExpandedId} onStatusChange={onStatusChange} />
          )}
          {view === 'calendar' && <CalendarView jobs={filtered} onOpenJob={setExpandedId} />}
          {view === 'stats' && <StatsView jobs={filtered} />}
        </div>
      </div>

      {/* ─── Expanded detail ────────────────────────────────────────────────── */}
      {expandedJob && t.expandedStyle === 'drawer' && (
        <DetailDrawer job={expandedJob} onClose={() => setExpandedId(null)}
          onEdit={j => setEditingJob(j)} onDelete={deleteJob} onUpdate={updateJob} />
      )}
      {expandedJob && t.expandedStyle === 'modal' && (
        <DetailModal job={expandedJob} onClose={() => setExpandedId(null)}
          onEdit={j => setEditingJob(j)} onDelete={deleteJob} onUpdate={updateJob} />
      )}
      {expandedJob && t.expandedStyle === 'inline' && view !== 'table' && (
        <DetailDrawer job={expandedJob} onClose={() => setExpandedId(null)}
          onEdit={j => setEditingJob(j)} onDelete={deleteJob} onUpdate={updateJob} />
      )}

      {(isAdding || editingJob) && (
        <AddJobModal
          initial={editingJob}
          onClose={() => { setIsAdding(false); setEditingJob(null); }}
          onSave={handleSaveJob}
        />
      )}

      {/* ─── Tweaks panel ───────────────────────────────────────────────────── */}
      <TweaksPanel title="Tweaks">
        <TweakSection label="Scene & Character" />
        <TweakSelect label="Scene" value={t.scene}
          options={SCENES.map(s => ({ value: s.id, label: s.label }))}
          onChange={v => setTweak('scene', v)} />
        <TweakSelect label="Character" value={t.character}
          options={CHARACTERS.map(c => ({ value: c.id, label: c.name }))}
          onChange={v => setTweak('character', v)} />

        <TweakSection label="Theme" />
        <TweakSelect label="Palette" value={t.theme}
          options={[
            { value: 'stardew',   label: 'Stardew (cozy)' },
            { value: 'terraria',  label: 'Terraria (fantasy)' },
            { value: 'gameboy',   label: 'Game Boy (mono)' },
            { value: 'synthwave', label: 'Synthwave (neon)' },
          ]}
          onChange={v => setTweak('theme', v)} />
        <TweakRadio label="Mode" value={t.mode}
          options={['light', 'dark']}
          onChange={v => setTweak('mode', v)} />
        <TweakSelect label="Accent" value={t.accent}
          options={[
            { value: 'default', label: 'Theme default' },
            { value: 'emerald', label: 'Emerald' },
            { value: 'rose',    label: 'Rose' },
            { value: 'azure',   label: 'Azure' },
            { value: 'amber',   label: 'Amber' },
          ]}
          onChange={v => setTweak('accent', v)} />

        <TweakSection label="Type" />
        <TweakSelect label="Font set" value={t.font}
          options={[
            { value: 'pixelify', label: 'Pixelify (default)' },
            { value: 'retro',    label: 'Retro Terminal' },
            { value: 'jersey',   label: 'Jersey' },
          ]}
          onChange={v => setTweak('font', v)} />

        <TweakSection label="Layout" />
        <TweakSelect label="Density" value={t.density}
          options={[
            { value: 'compact', label: 'Compact' },
            { value: 'regular', label: 'Regular' },
            { value: 'comfy',   label: 'Comfy' },
          ]}
          onChange={v => setTweak('density', v)} />
        <TweakSelect label="Expanded view" value={t.expandedStyle}
          options={[
            { value: 'drawer', label: 'Side panel' },
            { value: 'modal',  label: 'Modal' },
            { value: 'inline', label: 'Inline row' },
          ]}
          onChange={v => setTweak('expandedStyle', v)} />

        <TweakSection label="Columns" />
        <TweakToggle label="Company"      value={t.showCompany}   onChange={v => setTweak('showCompany', v)} />
        <TweakToggle label="Role"         value={t.showRole}      onChange={v => setTweak('showRole', v)} />
        <TweakToggle label="Date applied" value={t.showAppliedAt} onChange={v => setTweak('showAppliedAt', v)} />
        <TweakToggle label="Status"       value={t.showStatus}    onChange={v => setTweak('showStatus', v)} />
        <TweakToggle label="Source"       value={t.showSource}    onChange={v => setTweak('showSource', v)} />
        <TweakToggle label="Resume"       value={t.showResume}    onChange={v => setTweak('showResume', v)} />
      </TweaksPanel>
    </div>
  );
}
