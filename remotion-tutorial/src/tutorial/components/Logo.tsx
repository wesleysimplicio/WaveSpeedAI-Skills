import React from 'react';
import { useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';
import { colors, fonts, gradients } from '../theme';

type Props = {
  size?: number;
  startFrame?: number;
};

export const Logo: React.FC<Props> = ({ size = 110, startFrame = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - startFrame;
  const enter = spring({
    frame: local,
    fps,
    config: { damping: 14, stiffness: 110 },
  });
  const wave = (i: number) =>
    Math.sin((frame * 0.12) + i * 0.7) * 0.45 + 0.55;

  return (
    <div
      style={{
        position: 'relative',
        width: size,
        height: size,
        opacity: enter,
        transform: `scale(${interpolate(enter, [0, 1], [0.4, 1])})`,
        display: 'grid',
        placeItems: 'center',
        borderRadius: '28%',
        background: gradients.brand,
        boxShadow: `0 0 ${size * 0.6}px ${colors.violet}88`,
        fontFamily: fonts.sans,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: size * 0.06,
          height: size * 0.55,
        }}
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            style={{
              width: size * 0.07,
              height: `${wave(i) * 100}%`,
              background: 'white',
              borderRadius: size * 0.04,
              boxShadow: '0 0 8px rgba(255,255,255,0.7)',
            }}
          />
        ))}
      </div>
    </div>
  );
};
