import React from 'react';
import {Composition, Folder} from 'remotion';
import {SF1, SF2, SF3, SF4, SF5, SF5Desktop} from './styleframes/StyleFrames';
import {FPS, H, W} from './theme';

const SF5Proposal: React.FC = () => <SF5 variant="proposal" />;

const still = {width: W, height: H, fps: FPS, durationInFrames: 1};

export const Root: React.FC = () => (
  <>
    <Folder name="StyleFrames">
      <Composition id="SF1-Hook" component={SF1} {...still} />
      <Composition id="SF2-Build" component={SF2} {...still} />
      <Composition id="SF3-Showcase" component={SF3} {...still} />
      <Composition id="SF4-Formats" component={SF4} {...still} />
      <Composition id="SF5-Desktop" component={SF5Desktop} {...still} />
      <Composition id="SF5-CTA" component={SF5} {...still} />
      <Composition id="SF5-CTA-usulan" component={SF5Proposal} {...still} />
    </Folder>
  </>
);
