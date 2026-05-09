import React from 'react';
import { spring, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { fonts, colors } from '../theme';

type Props = {
  label: string;
  startFrame?: number;
  delay?: number;
  color?: string;
  icon?: React.ReactNode;
};

export const Chip: React.FC<Props> = ({
  label,
  startFrame = 0,
  delay = 0,
  color = colors.violetSoft,
  icon,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - startFrame - delay;
  const enter = spring({
    frame: local,
    fps,
    config: { damping: 16, stiffness: 140, mass: 0.7 },
  });
  const scale = interpolate(enter, [0, 1], [0.6, 1]);
  const translate = interpolate(enter, [0, 1], [10, 0]);

  return (
    <div
      style={{
        opacity: enter,
        transform: `scale(${scale}) translateY(${translate}px)`,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '8px 16px',
        borderRadius: 999,
        background: 'rgba(255,255,255,0.04)',
        border: `1px solid ${color}55`,
        color,
        fontFamily: fonts.sans,
        fontWeight: 600,
        fontSize: 18,
        letterSpacing: 0.4,
      }}
    >
      {icon}
      {label}
    </div>
  );
};
