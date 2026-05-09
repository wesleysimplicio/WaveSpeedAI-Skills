import React from 'react';
import { AbsoluteFill } from 'remotion';
import { SceneFrame } from '../components/SceneFrame';
import { SceneTitle } from '../components/SceneTitle';
import { MediaPreview } from '../components/MediaPreview';
import { colors } from '../theme';
import { useStrings } from '../i18n';

export const SceneExamples: React.FC = () => {
  const t = useStrings().examples;
  return (
    <SceneFrame accent="cyan" particleSeed="examples" badge={t.badge}>
      <AbsoluteFill style={{ padding: '110px 96px 90px', display: 'flex', flexDirection: 'column', gap: 50 }}>
        <SceneTitle
          eyebrow={t.eyebrow}
          title={t.title}
          subtitle={t.subtitle}
          accent={colors.cyanSoft}
        />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 36,
            alignItems: 'start',
            justifyItems: 'center',
          }}
        >
          <MediaPreview
            variant="image"
            startFrame={20}
            delay={0}
            width={460}
            height={300}
            modelId="wavespeed-ai/z-image/turbo"
            label={t.items.image.label}
            prompt={t.items.image.prompt}
          />
          <MediaPreview
            variant="video"
            startFrame={20}
            delay={16}
            width={460}
            height={300}
            modelId="wavespeed-ai/seedance-v2"
            label={t.items.video.label}
            prompt={t.items.video.prompt}
          />
          <MediaPreview
            variant="llm"
            startFrame={20}
            delay={32}
            width={460}
            height={300}
            modelId="anthropic/claude-opus-4.6"
            label={t.items.llm.label}
            prompt={t.items.llm.prompt}
          />
        </div>
      </AbsoluteFill>
    </SceneFrame>
  );
};
