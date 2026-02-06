import { useState, useEffect, useRef } from "react";
import { Player, PlayerRef } from "@remotion/player";
import { composition } from "./remotion/compositions";

// Parse frame from URL hash (e.g., #frame=100)
const getFrameFromHash = (): number | null => {
  const hash = window.location.hash;
  if (!hash) return null;

  const params = new URLSearchParams(hash.slice(1));
  const frameParam = params.get("frame");

  if (frameParam) {
    const frame = parseInt(frameParam, 10);
    if (!isNaN(frame) && frame >= 0) {
      return frame;
    }
  }

  return null;
};

export const App = () => {
  const playerRef = useRef<PlayerRef>(null);
  const [playerSize, setPlayerSize] = useState<React.CSSProperties>({
    width: "100%",
    height: "100%",
  });

  // Get initial frame from URL hash
  const initialFrame = getFrameFromHash();
  const shouldAutoPlay = initialFrame === null;

  // Calculate the player size based on composition aspect ratio
  const calculatePlayerSize = () => {
    if (typeof window === "undefined") return { width: "100%", height: "100%" };

    const aspectRatio = composition.width / composition.height;

    // Maximum available space
    const maxWidth = window.innerWidth * 0.9;
    const maxHeight = window.innerHeight * 0.85;

    let playerWidth = maxWidth;
    let playerHeight = playerWidth / aspectRatio;

    // If height exceeds max height, scale down
    if (playerHeight > maxHeight) {
      playerHeight = maxHeight;
      playerWidth = playerHeight * aspectRatio;
    }

    return {
      width: `${playerWidth}px`,
      height: `${playerHeight}px`,
      maxWidth: "100%",
      maxHeight: "100%",
    };
  };

  // Update player size on window resize
  useEffect(() => {
    const updateSize = () => {
      setPlayerSize(calculatePlayerSize());
    };

    updateSize();
    window.addEventListener("resize", updateSize);

    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Seek to frame from URL hash on mount
  useEffect(() => {
    if (initialFrame !== null && playerRef.current) {
      playerRef.current.seekTo(initialFrame);
    }
  }, [initialFrame]);

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen p-2">
      <div className="w-full h-full flex flex-col items-center justify-center">
        <div className="w-full h-full flex items-center justify-center">
          <Player
            ref={playerRef}
            component={composition.component}
            durationInFrames={composition.durationInFrames}
            fps={composition.fps}
            compositionHeight={composition.height}
            compositionWidth={composition.width}
            controls
            autoPlay={shouldAutoPlay}
            loop
            style={playerSize}
            allowFullscreen
            doubleClickToFullscreen
            initialFrame={initialFrame ?? 0}
            numberOfSharedAudioTags={10}
          />
        </div>
      </div>
    </div>
  );
};
