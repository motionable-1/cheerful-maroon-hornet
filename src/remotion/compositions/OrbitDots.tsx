import React, { useMemo } from "react";
import { useCurrentFrame, useVideoConfig, random } from "remotion";

interface OrbitDotsProps {
  /** Number of dots per ring */
  dotsPerRing?: number;
  /** Number of rings */
  rings?: number;
  /** Beat timestamps */
  beats: number[];
  /** Dot colors */
  colors?: string[];
  /** Center X */
  cx?: number;
  /** Center Y */
  cy?: number;
  /** Base orbit radius */
  baseRadius?: number;
}

export const OrbitDots: React.FC<OrbitDotsProps> = ({
  dotsPerRing = 12,
  rings = 3,
  beats,
  colors = ["#F72585", "#4CC9F0", "#7209B7", "#4361EE"],
  cx = 960,
  cy = 540,
  baseRadius = 260,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentTime = frame / fps;

  const dotConfigs = useMemo(() => {
    const configs: Array<{
      ring: number;
      index: number;
      angle: number;
      speed: number;
      size: number;
      color: string;
      orbitRadius: number;
    }> = [];

    for (let r = 0; r < rings; r++) {
      for (let d = 0; d < dotsPerRing; d++) {
        const idx = r * dotsPerRing + d;
        configs.push({
          ring: r,
          index: d,
          angle: (d / dotsPerRing) * Math.PI * 2,
          speed: 0.3 + random(`orbit-spd-${idx}`) * 0.6,
          size: 3 + random(`orbit-sz-${idx}`) * 5,
          color: colors[idx % colors.length],
          orbitRadius: baseRadius + r * 50,
        });
      }
    }
    return configs;
  }, [dotsPerRing, rings, colors, baseRadius]);

  // Beat reactivity
  const lastBeatTime = beats.reduce(
    (acc, b) => (b <= currentTime ? b : acc),
    -10,
  );
  const timeSinceBeat = currentTime - lastBeatTime;
  const beatPulse = Math.max(0, 1 - timeSinceBeat * 3);

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    >
      {dotConfigs.map((dot, i) => {
        const direction = dot.ring % 2 === 0 ? 1 : -1;
        const angle = dot.angle + currentTime * dot.speed * direction;
        const radiusBounce = dot.orbitRadius + beatPulse * 20;
        const x = cx + Math.cos(angle) * radiusBounce;
        const y = cy + Math.sin(angle) * radiusBounce;

        const sizeBounce = dot.size * (1 + beatPulse * 0.5);

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x - sizeBounce / 2,
              top: y - sizeBounce / 2,
              width: sizeBounce,
              height: sizeBounce,
              borderRadius: "50%",
              backgroundColor: dot.color,
              boxShadow: `0 0 ${6 + beatPulse * 10}px ${dot.color}`,
              opacity: 0.6 + beatPulse * 0.4,
            }}
          />
        );
      })}
    </div>
  );
};
