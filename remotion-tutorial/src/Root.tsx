import { Composition } from 'remotion';
import { Tutorial } from './tutorial/Tutorial';
import { TUTORIAL_DURATION_FRAMES, TUTORIAL_FPS } from './tutorial/timing';

export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="WaveSpeedSkillTutorial"
        component={Tutorial}
        durationInFrames={TUTORIAL_DURATION_FRAMES}
        fps={TUTORIAL_FPS}
        width={1920}
        height={1080}
      />
    </>
  );
};
