'use client';

import React from 'react';
import { ImgSprite, HeartSprite } from './sprites';
import { STATUSES, STATUS_ICONS } from './data';

// ── PixelIcon ─────────────────────────────────────────────────────────────────
interface PixelIconProps { name: string; size?: number; color?: string; }

export function PixelIcon({ name, size = 16, color = 'currentColor' }: PixelIconProps) {
  const s = size;
  const icons: Record<string, React.ReactNode> = {
    search: <><rect x="2" y="2" width="6" height="6" fill="none" stroke={color} strokeWidth="2"/><rect x="8" y="8" width="2" height="2" fill={color}/><rect x="10" y="10" width="2" height="2" fill={color}/></>,
    plus:   <><rect x="6" y="2" width="2" height="10" fill={color}/><rect x="2" y="6" width="10" height="2" fill={color}/></>,
    x:      <><rect x="2" y="2" width="2" height="2" fill={color}/><rect x="4" y="4" width="2" height="2" fill={color}/><rect x="6" y="6" width="2" height="2" fill={color}/><rect x="8" y="8" width="2" height="2" fill={color}/><rect x="10" y="10" width="2" height="2" fill={color}/><rect x="2" y="10" width="2" height="2" fill={color}/><rect x="4" y="8" width="2" height="2" fill={color}/><rect x="8" y="4" width="2" height="2" fill={color}/><rect x="10" y="2" width="2" height="2" fill={color}/></>,
    trash:  <><rect x="3" y="1" width="8" height="2" fill={color}/><rect x="1" y="3" width="12" height="2" fill={color}/><rect x="3" y="5" width="2" height="8" fill={color}/><rect x="9" y="5" width="2" height="8" fill={color}/><rect x="6" y="6" width="2" height="6" fill={color}/></>,
    edit:   <><rect x="9" y="1" width="3" height="3" fill={color}/><rect x="6" y="4" width="3" height="3" fill={color}/><rect x="3" y="7" width="3" height="3" fill={color}/><rect x="2" y="10" width="2" height="2" fill={color}/></>,
    ext:    <><rect x="2" y="2" width="6" height="2" fill={color}/><rect x="8" y="2" width="2" height="2" fill={color}/><rect x="10" y="2" width="2" height="2" fill={color}/><rect x="10" y="4" width="2" height="2" fill={color}/><rect x="2" y="4" width="2" height="8" fill={color}/><rect x="4" y="10" width="8" height="2" fill={color}/><rect x="10" y="6" width="2" height="2" fill={color}/></>,
    check:  <><rect x="10" y="2" width="2" height="2" fill={color}/><rect x="8" y="4" width="2" height="2" fill={color}/><rect x="6" y="6" width="2" height="2" fill={color}/><rect x="4" y="8" width="2" height="2" fill={color}/><rect x="2" y="6" width="2" height="2" fill={color}/><rect x="4" y="6" width="2" height="2" fill={color}/></>,
    grid:   <><rect x="1" y="1" width="5" height="5" fill={color}/><rect x="8" y="1" width="5" height="5" fill={color}/><rect x="1" y="8" width="5" height="5" fill={color}/><rect x="8" y="8" width="5" height="5" fill={color}/></>,
    table:  <><rect x="1" y="2" width="12" height="2" fill={color}/><rect x="1" y="6" width="12" height="2" fill={color}/><rect x="1" y="10" width="12" height="2" fill={color}/></>,
    calendar: <><rect x="1" y="2" width="12" height="11" fill="none" stroke={color} strokeWidth="2"/><rect x="3" y="0" width="2" height="3" fill={color}/><rect x="9" y="0" width="2" height="3" fill={color}/><rect x="1" y="5" width="12" height="1" fill={color}/></>,
    chart:  <><rect x="1" y="9" width="2" height="4" fill={color}/><rect x="5" y="5" width="2" height="8" fill={color}/><rect x="9" y="1" width="2" height="12" fill={color}/></>,
    chevron_l: <><rect x="8" y="2" width="2" height="2" fill={color}/><rect x="6" y="4" width="2" height="2" fill={color}/><rect x="4" y="6" width="2" height="2" fill={color}/><rect x="6" y="8" width="2" height="2" fill={color}/><rect x="8" y="10" width="2" height="2" fill={color}/></>,
    chevron_r: <><rect x="4" y="2" width="2" height="2" fill={color}/><rect x="6" y="4" width="2" height="2" fill={color}/><rect x="8" y="6" width="2" height="2" fill={color}/><rect x="6" y="8" width="2" height="2" fill={color}/><rect x="4" y="10" width="2" height="2" fill={color}/></>,
  };
  return (
    <svg width={s} height={s} viewBox="0 0 14 14" style={{ shapeRendering: 'crispEdges', display: 'inline-block', flexShrink: 0 }}>
      {icons[name] || null}
    </svg>
  );
}

// ── StatusPill ────────────────────────────────────────────────────────────────
interface StatusPillProps { statusId: string; large?: boolean; }

export function StatusPill({ statusId, large = false }: StatusPillProps) {
  const s = STATUSES.find(x => x.id === statusId) || { label: statusId, color: '#888', icon: '?' };
  const iconSrc = STATUS_ICONS[statusId];
  const size = large ? 22 : 16;
  return (
    <span
      className="status-pill"
      style={{
        '--status-bg': s.color,
        fontSize: large ? 11 : 9.5,
        padding: large ? '7px 14px 6px' : '5px 10px 4px',
      } as React.CSSProperties}
    >
      {iconSrc
        ? <ImgSprite src={iconSrc} size={size} />
        : <span aria-hidden="true">{s.icon}</span>}
      <span>{s.label}</span>
    </span>
  );
}

// ── PixelCheck ────────────────────────────────────────────────────────────────
interface PixelCheckProps { checked: boolean; onClick?: () => void; label?: string; }

export function PixelCheck({ checked, onClick, label = 'Select' }: PixelCheckProps) {
  return (
    <span
      className="px-check"
      role="checkbox"
      aria-checked={checked ? 'true' : 'false'}
      aria-label={label}
      tabIndex={0}
      data-on={checked ? '1' : '0'}
      onClick={(e) => { e.stopPropagation(); onClick?.(); }}
      onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); onClick?.(); } }}
    />
  );
}

// ── Stars (pixel hearts) ──────────────────────────────────────────────────────
interface StarsProps { value: number; max?: number; onChange?: (v: number) => void; }

export function Stars({ value, max = 5, onChange }: StarsProps) {
  return (
    <span className="hearts" onClick={(e) => e.stopPropagation()}>
      {Array.from({ length: max }).map((_, i) => (
        <span
          key={i}
          className={i < value ? 'on' : ''}
          style={{ cursor: onChange ? 'pointer' : 'default', display: 'inline-flex' }}
          onClick={() => onChange?.(i + 1 === value ? 0 : i + 1)}
        >
          <HeartSprite scale={2} />
        </span>
      ))}
    </span>
  );
}

// ── Tag ───────────────────────────────────────────────────────────────────────
export function Tag({ children }: { children: React.ReactNode }) {
  return <span className="px-tag">{children}</span>;
}

// ── PixelButton ───────────────────────────────────────────────────────────────
interface PixelButtonProps {
  children?: React.ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'primary' | 'ghost' | 'danger';
  size?: 'md' | 'sm' | 'icon';
  title?: string;
  icon?: string;
  disabled?: boolean;
  type?: 'button' | 'submit';
}

export function PixelButton({ children, onClick, variant = 'default', size = 'md', title, icon, disabled, type = 'button' }: PixelButtonProps) {
  const cls = ['px-btn'];
  if (variant !== 'default') cls.push(variant);
  if (size === 'sm') cls.push('px-btn-sm');
  if (size === 'icon') cls.push('px-btn-icon');
  return (
    <button type={type} className={cls.join(' ')} onClick={onClick} title={title} disabled={disabled}>
      {icon && <PixelIcon name={icon} size={12} />}
      {children}
    </button>
  );
}

// ── Date helpers ──────────────────────────────────────────────────────────────
export function fmtDate(iso: string) {
  if (!iso) return '';
  const d = new Date(iso + 'T12:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
export function fmtDateFull(iso: string) {
  if (!iso) return '';
  const d = new Date(iso + 'T12:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
export function daysAgo(iso: string) {
  if (!iso) return '';
  const d = new Date(iso + 'T12:00:00');
  const now = new Date();
  const diff = Math.round((now.getTime() - d.getTime()) / 86400000);
  if (diff === 0) return 'today';
  if (diff === 1) return '1 day ago';
  if (diff < 7) return diff + ' days ago';
  if (diff < 30) return Math.round(diff / 7) + 'w ago';
  return Math.round(diff / 30) + 'mo ago';
}

export { ImgSprite };
