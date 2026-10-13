// Logo mark "Arus": kotak membulat + satu gelombang arus. Geometris, sederhana.
import React from 'react';
import {color} from '../theme';

export const Logo: React.FC<{size: number}> = ({size}) => (
  <svg width={size} height={size} viewBox="0 0 40 40" style={{display: 'block', flexShrink: 0}}>
    <rect width="40" height="40" rx="11" fill={color.ink} />
    {/* dua gelombang sejajar: arus kas */}
    <path d="M9 17.5 C 14 12.5, 18 12.5, 20 17.5 S 26 22.5, 31 17.5" fill="none" stroke={color.bg} strokeWidth="3.4" strokeLinecap="round" />
    <path d="M9 25.5 C 14 20.5, 18 20.5, 20 25.5 S 26 30.5, 31 25.5" fill="none" stroke={color.bg} strokeWidth="3.4" strokeLinecap="round" opacity="0.45" />
  </svg>
);
