import { AbsoluteFill, Artifact, useCurrentFrame } from "remotion";
import { TextAnimation } from "../library/components/text/TextAnimation";
import { loadFont } from "@remotion/google-fonts/Inter";

// This re-runs on every HMR update of this file
const hmrKey = Date.now();

export const Main: React.FC = () => {
  const { fontFamily } = loadFont();
  const frame = useCurrentFrame();
  return (
    <>
      {/* Leave this here to generate a thumbnail */}
      {frame === 0 && (
        <Artifact content={Artifact.Thumbnail} filename="thumbnail.jpeg" />
      )}
      <AbsoluteFill className="flex items-center justify-center bg-white">
        <TextAnimation
          key={hmrKey}
          className="text-5xl font-bold text-center"
          style={{ fontFamily }}
          createTimeline={({ textRef, tl, SplitText }) => {
            // Split the text into individual characters using the ref
            const splitText = new SplitText(textRef.current, {
              type: "chars",
              charsClass: "char",
            });

            // Use fromTo to ensure initial state is part of the timeline
            tl.fromTo(
              splitText.chars,
              {
                opacity: 0,
                y: 50,
                rotationX: 90,
              },
              {
                opacity: 1,
                y: 0,
                rotationX: 0,
                duration: 0.8,
                stagger: 0.05,
                ease: "back.out(1.7)",
              },
            );

            // Optional: Add a subtle hover effect that scales characters
            tl.to(
              splitText.chars,
              {
                scale: 1.1,
                duration: 0.3,
                stagger: 0.02,
                yoyo: true,
                repeat: 1,
                ease: "power2.inOut",
              },
              "+=0.5",
            );

            return tl;
          }}
        >
          welcome to <span className="text-blue-400 font-light">Motionabl</span>
        </TextAnimation>
      </AbsoluteFill>
    </>
  );
};
