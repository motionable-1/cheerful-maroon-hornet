import React, { useMemo } from "react";
import { useCurrentFrame, useVideoConfig, random } from "remotion";

interface FrequencyBarsProps {
  /** Number of bars */
  count?: number;
  /** Beat timestamps in seconds */
  beats: number[];
  /** Bar colors [start, end] for gradient */
  colors?: [string, string];
  /** Width of the entire bar area */
  width?: number;
  /** Max bar height */
  maxHeight?: number;
  /** Position Y */
  y?: number;
  /** Position X */
  x?: number;
  /** Mirror mode */
  mirror?: boolean;
}

export const FrequencyBars: React.FC<FrequencyBarsProps> = ({
  count = 48,
  beats,
  colors = ["#F72585", "#4361EE"],
  width = 900,
  maxHeight = 200,
  y = 540,
  x = 510,
  mirror = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentTime = frame / fps;

  const barConfigs = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        freq1: 0.8 + random(`freq-f1-${i}`) * 3,
        freq2: 1.5 + random(`freq-f2-${i}`) * 4,
        freq3: 0.3 + random(`freq-f3-${i}`) * 1.5,
        phase1: random(`freq-p1-${i}`) * Math.PI * 2,
        phase2: random(`freq-p2-${i}`) * Math.PI * 2,
        phase3: random(`freq-p3-${i}`) * Math.PI * 2,
        amp1: 0.3 + random(`freq-a1-${i}`) * 0.7,
        amp2: 0.1 + random(`freq-a2-${i}`) * 0.3,
        amp3: 0.05 + random(`freq-a3-${i}`) * 0.15,
      })),
    [count],
  );

  // Beat reactivity
  const lastBeatTime = beats.reduce(
    (acc, b) => (b <= currentTime ? b : acc),
    -10,
  );
  const timeSinceBeat = currentTime - lastBeatTime;
  const beatPunch = Math.max(0, 1 - timeSinceBeat * 4);

  const barWidth = (width - (count - 1) * 2) / count;
  const gap = 2;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: mirror ? y - maxHeight : y - maxHeight,
        width,
        height: mirror ? maxHeight * 2 : maxHeight,
        overflow: "visible",
      }}
    >
      {barConfigs.map((cfg, i) => {
        const t = currentTime;
        const raw =
          cfg.amp1 * (0.5 + 0.5 * Math.sin(t * cfg.freq1 + cfg.phase1)) +
          cfg.amp2 * (0.5 + 0.5 * Math.sin(t * cfg.freq2 + cfg.phase2)) +
          cfg.amp3 * (0.5 + 0.5 * Math.sin(t * cfg.freq3 + cfg.phase3));

        const normalizedHeight = Math.max(0.05, Math.min(1, raw));
        const boosted = normalizedHeight * (1 + beatPunch * 0.8);
        const barHeight = Math.min(maxHeight, boosted * maxHeight);

        // Color interpolation based on position
        const colorProgress = i / count;
        const barX = i * (barWidth + gap);

        return (
          <React.Fragment key={i}>
            {/* Top bar */}
            <div
              style={{
                position: "absolute",
                left: barX,
                bottom: mirror ? maxHeight : 0,
                width: barWidth,
                height: barHeight,
                background: `linear-gradient(to top, ${colors[0]}, ${colors[1]})`,
                borderRadius: barWidth / 2,
                opacity: 0.7 + beatPunch * 0.3,
                boxShadow:
                  beatPunch > 0.3
                    ? `0 0 ${8 * beatPunch}px ${colors[0]}40`
                    : "none",
              }}
            />
            {/* Mirror bar */}
            {mirror && (
              <div
                style={{
                  position: "absolute",
                  left: barX,
                  top: maxHeight,
                  width: barWidth,
                  height: barHeight * 0.6,
                  background: `linear-gradient(to bottom, ${colors[0]}80, ${colors[1]}20)`,
                  borderRadius: barWidth / 2,
                  opacity: 0.35 + beatPunch * 0.15,
                }}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
