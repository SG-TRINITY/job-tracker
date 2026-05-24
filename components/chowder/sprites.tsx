'use client';

import React from 'react';

interface PixelSpriteProps {
  rows: string[];
  palette: Record<string, string | null>;
  scale?: number;
  style?: React.CSSProperties;
}

export function PixelSprite({ rows, palette, scale = 2, style }: PixelSpriteProps) {
  const h = rows.length;
  const w = Math.max(...rows.map(r => r.length));
  return (
    <svg
      width={w * scale} height={h * scale}
      viewBox={`0 0 ${w} ${h}`}
      style={{ shapeRendering: 'crispEdges', display: 'inline-block', flexShrink: 0, ...(style || {}) }}
    >
      {rows.map((row, y) =>
        [...row].map((ch, x) => {
          const c = palette[ch];
          if (!c) return null;
          return <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill={c} />;
        })
      )}
    </svg>
  );
}

interface ImgSpriteProps {
  src: string;
  size?: number;
  alt?: string;
  style?: React.CSSProperties;
}

export function ImgSprite({ src, size = 20, alt = '', style }: ImgSpriteProps) {
  return (
    <img
      src={src} alt={alt} width={size} height={size}
      style={{
        imageRendering: 'pixelated',
        display: 'inline-block',
        flexShrink: 0,
        objectFit: 'contain',
        ...(style || {}),
      }}
    />
  );
}

// ─── Sprite data ──────────────────────────────────────────────────────────────

const SPR_HEART = {
  rows: ['.bRRb..bRRb.','bRwRRbbRRRb.','bRRRRRRRRRRb','bRRRRRRRRRRb','.bRRRRRRRRb.','..bRRRRRRb..','...bRRRRb...','....bRRb.....','.....bb.....'],
  palette: { b: '#1a0a06', R: '#d83458', w: '#ff90a4', '.': null as null },
};

const SPR_MUSHROOM = {
  rows: ['....bbbbbb....','..bbRRRRRRbb..', '.bRRwRRwRRRRb.', '.bRRRRRRRRRRb.','bRwRRRRRRRRRRb','bRRRRRRwRRRRwb','bRRRRRRRRRRRRb','.bbbWWWWWWbbb.','..bbWWWWWWb...','....bWWWWb....','....bCCCCb....','....bCCCCb....','....bbbbbb....'],
  palette: { b: '#1a0a06', R: '#d04540', w: '#fff8e8', W: '#fffce8', C: '#e8d4a0', '.': null as null },
};

interface SpriteProps { scale?: number; style?: React.CSSProperties; }

export const HeartSprite = ({ scale = 2, style }: SpriteProps) => (
  <PixelSprite {...SPR_HEART} scale={scale} style={style} />
);
export const MushroomSprite = ({ scale = 2, style }: SpriteProps) => (
  <PixelSprite {...SPR_MUSHROOM} scale={scale} style={style} />
);
