// LineChart — grafik garis utama dengan area fill.
// - draw:   0→1, garis tergambar (evolvePath)
// - area:   0→1, area fill menyusul di belakang ujung garis
// - morph:  0→1, data "7 hari" → "30 hari" (interpolatePath)
// - pulse:  0→1, satu pulse ring dari titik terakota (null = tidak ada)
// Titik terakota di ujung garis = motif kursor blok dari terminal.
import React, {useId} from 'react';
import {evolvePath, getLength, getPointAtLength, interpolatePath} from '@remotion/paths';
import {series, xLabels, yMax, yTicks} from '../lib/data';
import {Pt, smoothPath} from '../lib/path';
import {alpha, color, font, type} from '../theme';

type Props = {
  w: number;
  h: number;
  draw?: number;
  area?: number;
  morph?: number;
  pulse?: number | null;
  dotScale?: number;
  fontSize?: number;
};

const toPts = (vals: number[], pw: number, ph: number): Pt[] =>
  vals.map((v, i) => [(i / (vals.length - 1)) * pw, ph - (v / yMax) * ph]);

export const LineChart: React.FC<Props> = ({
  w,
  h,
  draw = 1,
  area = 1,
  morph = 1,
  pulse = null,
  dotScale = 1,
  fontSize = 15,
}) => {
  const axisW = fontSize * 3.6; // ruang label sumbu-y
  const axisH = fontSize * 2.4; // ruang label sumbu-x
  const pw = w - axisW;
  const ph = h - axisH;

  const pathA = smoothPath(toPts(series.before, pw, ph));
  const pathB = smoothPath(toPts(series.after, pw, ph));
  const line = morph <= 0 ? pathA : morph >= 1 ? pathB : interpolatePath(morph, pathA, pathB);

  const len = getLength(line);
  const evolved = evolvePath(draw, line);
  const tip = getPointAtLength(line, Math.max(0.001, len * draw)) ?? {x: 0, y: ph};
  const areaTip = getPointAtLength(line, Math.max(0.001, len * area)) ?? {x: 0, y: ph};
  const areaPath = `${line} L ${pw} ${ph} L 0 ${ph} Z`;
  // id unik per instance: beberapa grafik bisa tampil bersamaan (scene 4)
  const gid = `arus-area-${useId().replace(/:/g, '')}`;

  const label: React.CSSProperties = {
    position: 'absolute',
    fontFamily: font.sans,
    fontWeight: 500,
    fontSize,
    color: color.ink2,
    whiteSpace: 'nowrap',
    ...type.num,
  };

  return (
    <div style={{position: 'relative', width: w, height: h}}>
      {/* Label & hairline sumbu-y */}
      {yTicks.map((t) => {
        const y = ph - (t / yMax) * ph;
        return (
          <React.Fragment key={t}>
            <div style={{...label, left: 0, top: y - fontSize * 0.65, width: axisW - fontSize, textAlign: 'right'}}>
              {t === 0 ? '0' : `${t} jt`}
            </div>
            <div style={{position: 'absolute', left: axisW, top: y, width: pw, height: 1, background: color.line}} />
          </React.Fragment>
        );
      })}
      {/* Label sumbu-x: crossfade saat data berganti */}
      {(['before', 'after'] as const).map((k) => {
        const o = k === 'before' ? 1 - morph : morph;
        if (o <= 0.001) return null;
        const labels = xLabels[k];
        return labels.map((l, i) => {
          const x = axisW + (i / (labels.length - 1)) * pw;
          const anchor = i === 0 ? '0%' : i === labels.length - 1 ? '-100%' : '-50%';
          return (
            <div key={k + l} style={{...label, left: x, top: ph + fontSize * 0.9, transform: `translateX(${anchor})`, opacity: o}}>
              {l}
            </div>
          );
        });
      })}

      <svg width={pw + 40} height={ph + 40} style={{position: 'absolute', left: axisW, top: 0, overflow: 'visible'}}>
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color.ink} stopOpacity={0.09} />
            <stop offset="100%" stopColor={color.ink} stopOpacity={0} />
          </linearGradient>
          <clipPath id={`${gid}-clip`}>
            <rect x={-2} y={-40} width={Math.max(0, areaTip.x + 2)} height={ph + 80} />
          </clipPath>
        </defs>
        {area > 0 && <path d={areaPath} fill={`url(#${gid})`} clipPath={`url(#${gid}-clip)`} />}
        <path
          d={line}
          fill="none"
          stroke={color.ink}
          strokeWidth={fontSize * 0.2}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={evolved.strokeDasharray}
          strokeDashoffset={evolved.strokeDashoffset}
        />
        {/* Pulse ring */}
        {pulse !== null && pulse > 0 && pulse < 1 && (
          <circle
            cx={tip.x}
            cy={tip.y}
            r={fontSize * (0.5 + pulse * 1.6)}
            fill="none"
            stroke={color.accent}
            strokeWidth={fontSize * 0.12}
            opacity={0.5 * (1 - pulse)}
          />
        )}
        {/* Titik terakota: kepala garis */}
        {draw > 0 && (
          <g transform={`translate(${tip.x} ${tip.y}) scale(${dotScale})`}>
            <circle r={fontSize * 0.62} fill={alpha(color.accent, 0.16)} />
            <circle r={fontSize * 0.36} fill={color.accent} />
          </g>
        )}
      </svg>
    </div>
  );
};
