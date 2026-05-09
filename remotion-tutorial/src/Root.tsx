import { Composition } from 'remotion';
import { Tutorial } from './tutorial/Tutorial';
import { TUTORIAL_DURATION_FRAMES, TUTORIAL_FPS } from './tutorial/timing';

export const Root: React.FC = () => {
  return (
    <>
      {/* Default — pt-BR. Kept under the original id so existing renders
          (docs/media/tutorial.mp4) keep regenerating to the same path. */}
      <Composition
        id="WaveSpeedSkillTutorial"
        component={Tutorial}
        durationInFrames={TUTORIAL_DURATION_FRAMES}
        fps={TUTORIAL_FPS}
        width={1920}
        height={1080}
        defaultProps={{ locale: 'pt-BR' as const }}
      />
      <Composition
        id="WaveSpeedSkillTutorialEN"
        component={Tutorial}
        durationInFrames={TUTORIAL_DURATION_FRAMES}
        fps={TUTORIAL_FPS}
        width={1920}
        height={1080}
        defaultProps={{ locale: 'en' as const }}
      />
    </>
  );
};
