import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";

interface PulseRingProps {
  /** Beat timestamps in seconds */
  beats: number[];
  /** Ring color */
  color?: string;
  /** Base radius */
  baseRadius?: number;
  /** Max scale on beat */
  beatScale?: number;
  /** Ring stroke width */
  strokeWidth?: number;
  /** Center X */
  cx?: number;
  /** Center Y */
  cy?: number;
}

export const PulseRing: React.FC<PulseRingProps> = ({
  beats,
  color = "#F72585",
  baseRadius = 120,
  beatScale = 1.6,
  strokeWidth = 3,
  cx = 960,
  cy = 540,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentTime = frame / fps;

  // Find the most recent beat
  const lastBeatTime = beats.reduce(
    (acc, b) => (b <= currentTime ? b : acc),
    -10,
  );
  const timeSinceBeat = currentTime - lastBeatTime;
  const beatDecay = Math.max(0, 1 - timeSinceBeat * 3.5); // Fast decay

  // Scale and opacity driven by beats
  const scale = 1 + (beatScale - 1) * Math.pow(beatDecay, 0.5);
  const opacity = interpolate(beatDecay, [0, 0.3, 1], [0.1, 0.5, 0.9], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Slow ambient rotation
  const rotation = frame * 0.3;

  return (
    <svg
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    >
      {/* Outer glowing ring */}
      <circle
        cx={cx}
        cy={cy}
        r={baseRadius * scale}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        opacity={opacity}
        style={{
          filter: `drop-shadow(0 0 ${12 * beatDecay}px ${color})`,
          transform: `rotate(${rotation}deg)`,
          transformOrigin: `${cx}px ${cy}px`,
        }}
      />
      {/* Inner bright ring */}
      <circle
        cx={cx}
        cy={cy}
        r={baseRadius * scale * 0.7}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth * 0.5}
        opacity={opacity * 0.6}
        strokeDasharray="8 12"
        style={{
          transform: `rotate(${-rotation * 1.5}deg)`,
          transformOrigin: `${cx}px ${cy}px`,
        }}
      />
      {/* Smallest ring - solid */}
      <circle
        cx={cx}
        cy={cy}
        r={baseRadius * scale * 0.4}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth * 0.3}
        opacity={opacity * 0.4}
        style={{
          transform: `rotate(${rotation * 2}deg)`,
          transformOrigin: `${cx}px ${cy}px`,
        }}
      />
    </svg>
  );
};
