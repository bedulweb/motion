// Grain — film grain 3% yang berganti tiap 2 frame + vignette radial lembut.
// Diletakkan di luar kamera: grain menempel di layar, tidak ikut bergerak.
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {H, W} from '../theme';

export const Grain: React.FC<{opacity?: number; vignette?: number}> = ({
  opacity = 0.03,
  vignette = 0.07,
}) => {
  const frame = useCurrentFrame();
  // Seed berubah tiap 2 frame → pola noise baru, tetap deterministik.
  const seed = Math.floor(frame / 2);
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <svg width={W} height={H} style={{position: 'absolute', inset: 0, opacity}}>
        <filter id={`grain-${seed}`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={seed} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width={W} height={H} filter={`url(#grain-${seed})`} />
      </svg>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 75% 70% at 50% 48%, rgba(20,20,19,0) 55%, rgba(20,20,19,${vignette}) 100%)`,
        }}
      />
    </AbsoluteFill>
  );
};
