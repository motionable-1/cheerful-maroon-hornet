import React, { useMemo } from "react";
import { useCurrentFrame, useVideoConfig, random } from "remotion";

interface WaveformCircleProps {
  /** Number of points around the circle */
  points?: number;
  /** Base radius */
  radius?: number;
  /** Beat timestamps in seconds */
  beats: number[];
  /** Colors for the waveform gradient */
  colors?: [string, string];
  /** Center X */
  cx?: number;
  /** Center Y */
  cy?: number;
  /** Seed for deterministic randomness */
  seed?: string;
}

export const WaveformCircle: React.FC<WaveformCircleProps> = ({
  points = 64,
  radius = 180,
  beats,
  colors = ["#4CC9F0", "#7209B7"],
  cx = 960,
  cy = 540,
  seed = "waveform",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentTime = frame / fps;

  // Pre-compute wave configs
  const waveConfigs = useMemo(
    () =>
      Array.from({ length: points }).map((_, i) => ({
        freq1: 1.5 + random(`${seed}-f1-${i}`) * 3,
        freq2: 0.5 + random(`${seed}-f2-${i}`) * 2,
        phase1: random(`${seed}-p1-${i}`) * Math.PI * 2,
        phase2: random(`${seed}-p2-${i}`) * Math.PI * 2,
        amp1: 0.3 + random(`${seed}-a1-${i}`) * 0.7,
        amp2: 0.1 + random(`${seed}-a2-${i}`) * 0.3,
      })),
    [points, seed],
  );

  // Calculate beat intensity
  const lastBeatTime = beats.reduce(
    (acc, b) => (b <= currentTime ? b : acc),
    -10,
  );
  const timeSinceBeat = currentTime - lastBeatTime;
  const beatIntensity = Math.max(0, 1 - timeSinceBeat * 3);

  // Generate path points
  const pathData = useMemo(() => {
    const pts: string[] = [];

    for (let i = 0; i <= points; i++) {
      const idx = i % points;
      const angle = (idx / points) * Math.PI * 2;
      const cfg = waveConfigs[idx];

      // Organic wave displacement
      const wave1 =
        cfg.amp1 * Math.sin(currentTime * cfg.freq1 + cfg.phase1 + angle * 3);
      const wave2 =
        cfg.amp2 * Math.cos(currentTime * cfg.freq2 + cfg.phase2 + angle * 5);

      // Beat-reactive amplitude boost
      const displacement = (wave1 + wave2) * (25 + beatIntensity * 45);

      const r = radius + displacement;
      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;

      pts.push(`${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`);
    }

    return pts.join(" ") + " Z";
  }, [points, radius, cx, cy, currentTime, beatIntensity, waveConfigs]);

  const gradientId = `waveform-grad-${seed}`;

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
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={colors[0]} />
          <stop offset="100%" stopColor={colors[1]} />
        </linearGradient>
      </defs>
      {/* Filled waveform shape */}
      <path
        d={pathData}
        fill={`url(#${gradientId})`}
        fillOpacity={0.08 + beatIntensity * 0.12}
        stroke={`url(#${gradientId})`}
        strokeWidth={2 + beatIntensity * 2}
        opacity={0.7 + beatIntensity * 0.3}
        style={{
          filter: `drop-shadow(0 0 ${8 + beatIntensity * 16}px ${colors[0]})`,
        }}
      />
    </svg>
  );
};
