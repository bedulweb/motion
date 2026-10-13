// Cursor — dua jenis kursor:
// 1. BlockCursor: kursor blok terakota dari terminal (motif utama video).
// 2. Pointer: kursor mouse untuk demo klik di scene 3.
import React from 'react';
import {color} from '../theme';

export const BlockCursor: React.FC<{
  w: number;
  h: number;
  fill?: string;
  style?: React.CSSProperties;
}> = ({w, h, fill = color.accent, style}) => (
  <div style={{width: w, height: h, background: fill, borderRadius: Math.max(1, w * 0.08), ...style}} />
);

// Panah pointer digambar sendiri (bukan ikon stok): ink dengan tepi ivory.
export const Pointer: React.FC<{size?: number; style?: React.CSSProperties}> = ({size = 44, style}) => (
  <svg width={size} height={size * 1.25} viewBox="0 0 32 40" style={{display: 'block', overflow: 'visible', ...style}}>
    <path
      d="M3 2.5 L3 31 L10.2 24.6 L15 35.5 L20.2 33.2 L15.5 22.6 L25.2 22.4 Z"
      fill={color.ink}
      stroke={color.bg}
      strokeWidth="2.2"
      strokeLinejoin="round"
    />
  </svg>
);
