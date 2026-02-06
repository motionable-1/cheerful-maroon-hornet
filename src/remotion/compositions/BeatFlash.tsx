import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

interface BeatFlashProps {
  /** Beat timestamps in seconds */
  beats: number[];
  /** Flash color */
  color?: string;
  /** Max opacity of flash */
  maxOpacity?: number;
}

export const BeatFlash: React.FC<BeatFlashProps> = ({
  beats,
  color = "#FFFFFF",
  maxOpacity = 0.15,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentTime = frame / fps;

  // Find nearest beat
  const lastBeatTime = beats.reduce(
    (acc, b) => (b <= currentTime ? b : acc),
    -10,
  );
  const timeSinceBeat = currentTime - lastBeatTime;
  const flashIntensity = Math.max(0, 1 - timeSinceBeat * 8); // Very fast decay

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        background: `radial-gradient(ellipse at 50% 50%, ${color}${Math.round(
          flashIntensity * maxOpacity * 255,
        )
          .toString(16)
          .padStart(2, "0")} 0%, transparent 70%)`,
      }}
    />
  );
};
