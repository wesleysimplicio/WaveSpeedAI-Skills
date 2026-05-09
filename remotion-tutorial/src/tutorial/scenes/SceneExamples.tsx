import React from 'react';
import { AbsoluteFill } from 'remotion';
import { SceneFrame } from '../components/SceneFrame';
import { SceneTitle } from '../components/SceneTitle';
import { MediaPreview } from '../components/MediaPreview';
import { colors } from '../theme';

export const SceneExamples: React.FC = () => {
  return (
    <SceneFrame accent="cyan" particleSeed="examples" badge="06 · O QUE DÁ PRA FAZER">
      <AbsoluteFill style={{ padding: '110px 96px 90px', display: 'flex', flexDirection: 'column', gap: 50 }}>
        <SceneTitle
          eyebrow="Three modalities, one CLI"
          title="Imagem, vídeo e LLM com o mesmo padrão de chamada"
          subtitle="Async por padrão. URLs prontas em outputs[0]. Webhooks opcionais para fila longa."
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
            label="Text → Image"
            prompt="cat astronaut, neon cyberpunk"
          />
          <MediaPreview
            variant="video"
            startFrame={20}
            delay={16}
            width={460}
            height={300}
            modelId="wavespeed-ai/seedance-v2"
            label="Image → Video"
            prompt="camera dolly in, soft lights"
          />
          <MediaPreview
            variant="llm"
            startFrame={20}
            delay={32}
            width={460}
            height={300}
            modelId="anthropic/claude-opus-4.6"
            label="Chat → LLM"
            prompt="resume em uma frase"
          />
        </div>
      </AbsoluteFill>
    </SceneFrame>
  );
};
