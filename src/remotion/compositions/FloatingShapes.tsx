import React, { useMemo } from "react";
import { useCurrentFrame, useVideoConfig, random } from "remotion";

interface FloatingShapesProps {
  count?: number;
  colors?: string[];
  seed?: string;
  beats: number[];
}

export const FloatingShapes: React.FC<FloatingShapesProps> = ({
  count = 8,
  colors = ["#F72585", "#7209B7", "#3A0CA3", "#4361EE", "#4CC9F0"],
  seed = "shapes",
  beats,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const currentTime = frame / fps;

  const shapes = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        x: random(`${seed}-x-${i}`) * width,
        y: random(`${seed}-y-${i}`) * height,
        size: 30 + random(`${seed}-sz-${i}`) * 100,
        speed: 0.2 + random(`${seed}-spd-${i}`) * 0.5,
        phase: random(`${seed}-ph-${i}`) * Math.PI * 2,
        color: colors[i % colors.length],
        type: Math.floor(random(`${seed}-tp-${i}`) * 3), // 0=circle, 1=diamond, 2=triangle
        rotSpeed: (random(`${seed}-rot-${i}`) - 0.5) * 40,
      })),
    [count, colors, seed, width, height],
  );

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
        inset: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {shapes.map((shape, i) => {
        const floatX =
          shape.x + Math.sin(currentTime * shape.speed + shape.phase) * 40;
        const floatY =
          shape.y +
          Math.cos(currentTime * shape.speed * 0.7 + shape.phase) * 30;
        const rotation = frame * shape.rotSpeed * 0.05;
        const scaleBounce = 1 + beatPulse * 0.15;

        const clipPath =
          shape.type === 1
            ? "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)"
            : shape.type === 2
              ? "polygon(50% 0%, 100% 100%, 0% 100%)"
              : undefined;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: floatX,
              top: floatY,
              width: shape.size,
              height: shape.size,
              backgroundColor: shape.color,
              borderRadius: shape.type === 0 ? "50%" : "4px",
              clipPath: clipPath,
              opacity: 0.06 + beatPulse * 0.04,
              transform: `translate(-50%, -50%) rotate(${rotation}deg) scale(${scaleBounce})`,
              filter: `blur(${20 + shape.size * 0.3}px)`,
            }}
          />
        );
      })}
    </div>
  );
};
