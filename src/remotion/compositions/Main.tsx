import {
  AbsoluteFill,
  Artifact,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
  interpolate,
  Easing,
} from "remotion";
import { Audio } from "@remotion/media";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { loadFont as loadBebasNeue } from "@remotion/google-fonts/BebasNeue";
import { loadFont as loadRaleway } from "@remotion/google-fonts/Raleway";
import { TextAnimation } from "../library/components/text/TextAnimation";
import { Particles } from "../library/components/effects/Particles";
import { Noise } from "../library/components/effects/Noise";
import { Vignette } from "../library/components/effects/Vignette";
import { Glow } from "../library/components/effects/Glow";
import { PulseRing } from "./PulseRing";
import { WaveformCircle } from "./WaveformCircle";
import { FrequencyBars } from "./FrequencyBars";
import { OrbitDots } from "./OrbitDots";
import { BeatFlash } from "./BeatFlash";
import { FloatingShapes } from "./FloatingShapes";

// ── Audio & Beat Data ─────────────────────────────────────────────
const MUSIC_URL =
  "https://pub-e3bfc0083b0644b296a7080b21024c5f.r2.dev/music/1770416248674_hvlgg5uvxu9_music_Dark_electronic_ambi.mp3";
const WHOOSH_URL =
  "https://pub-e3bfc0083b0644b296a7080b21024c5f.r2.dev/sfx/1770416281158_dgd7r09fqod_sfx_Electronic_whoosh_transition_w.mp3";
const IMPACT_URL =
  "https://pub-e3bfc0083b0644b296a7080b21024c5f.r2.dev/sfx/1770416105025_74g1z0nigbh_sfx_Deep_bass_impact_hit_with_sub_.mp3";

const BEATS = [
  6.04, 6.53, 7.03, 7.53, 8.03, 8.53, 9.03, 9.53, 10.03, 10.53, 11.03, 11.53,
  12.05,
];
const DOWNBEATS = [6.04, 8.03, 10.03, 12.05];

// ── Color Palette ─────────────────────────────────────────────────
const COLORS = {
  bg: "#050510",
  pink: "#F72585",
  purple: "#7209B7",
  deepPurple: "#3A0CA3",
  blue: "#4361EE",
  cyan: "#4CC9F0",
  white: "#FFFFFF",
};

const hmrKey = Date.now();

// ── Scene: Intro ──────────────────────────────────────────────────
const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Radial gradient background that breathes
  const breathe = Math.sin(frame * 0.03) * 0.15 + 0.5;

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% 50%, ${COLORS.deepPurple}${Math.round(
          breathe * 60,
        )
          .toString(16)
          .padStart(2, "0")} 0%, ${COLORS.bg} 70%)`,
      }}
    >
      <FloatingShapes beats={BEATS} seed="intro-shapes" count={10} />

      {/* Central glow orb */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: `translate(-50%, -50%) scale(${interpolate(
            frame,
            [0, 40],
            [0, 1],
            {
              extrapolateRight: "clamp",
              easing: Easing.out(Easing.exp),
            },
          )})`,
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${COLORS.cyan}30 0%, transparent 70%)`,
          filter: "blur(40px)",
        }}
      />

      {/* Title text */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "42%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
        }}
      >
        <Glow color={COLORS.pink} intensity={20} pulsate pulseDuration={1.5}>
          <TextAnimation
            key={`${hmrKey}-title`}
            className="text-[120px] font-normal tracking-[0.15em] uppercase"
            style={{
              fontFamily: loadBebasNeue().fontFamily,
              color: COLORS.white,
            }}
            createTimeline={({ textRef, tl, SplitText }) => {
              const split = new SplitText(textRef.current, { type: "chars" });
              tl.fromTo(
                split.chars,
                { opacity: 0, y: 80, scale: 0.5, filter: "blur(12px)" },
                {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  filter: "blur(0px)",
                  duration: 0.9,
                  stagger: 0.06,
                  ease: "back.out(1.7)",
                },
              );
              return tl;
            }}
          >
            RHYTHM
          </TextAnimation>
        </Glow>
      </div>

      {/* Subtitle */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "56%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
        }}
      >
        <TextAnimation
          key={`${hmrKey}-sub`}
          className="text-2xl tracking-[0.5em] uppercase"
          style={{ fontFamily: loadRaleway().fontFamily, color: COLORS.cyan }}
          startFrom={20}
          createTimeline={({ textRef, tl, SplitText }) => {
            const split = new SplitText(textRef.current, { type: "chars" });
            tl.fromTo(
              split.chars,
              { opacity: 0, y: 20 },
              {
                opacity: 1,
                y: 0,
                duration: 0.6,
                stagger: 0.04,
                ease: "power2.out",
              },
            );
            return tl;
          }}
        >
          VISUALIZER
        </TextAnimation>
      </div>

      {/* Horizontal line decorations */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: interpolate(frame, [15, 50], [0, 600], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.out(Easing.cubic),
          }),
          height: 1,
          backgroundColor: `${COLORS.cyan}40`,
        }}
      />

      <Particles
        type="sparks"
        count={30}
        speed={0.5}
        colors={[COLORS.pink, COLORS.cyan, COLORS.purple]}
        seed="intro-sparks"
      />
      <Noise type="grain" intensity={0.25} speed={1} opacity={0.4} />
      <Vignette intensity={0.8} size={0.3} />
    </AbsoluteFill>
  );
};

// ── Scene: Waveform Visualizer ────────────────────────────────────
const WaveformScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgPulse = Math.sin(frame * 0.02) * 0.3 + 0.5;

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% 45%, ${COLORS.purple}${Math.round(
          bgPulse * 40,
        )
          .toString(16)
          .padStart(2, "0")} 0%, ${COLORS.bg} 65%)`,
      }}
    >
      <FloatingShapes beats={BEATS} seed="wave-shapes" count={6} />

      {/* Waveform circle */}
      <WaveformCircle
        beats={BEATS}
        radius={160}
        points={80}
        colors={[COLORS.cyan, COLORS.purple]}
      />

      {/* Pulse rings - multiple layers */}
      <PulseRing
        beats={BEATS}
        color={COLORS.pink}
        baseRadius={130}
        beatScale={1.5}
        strokeWidth={2}
      />
      <PulseRing
        beats={DOWNBEATS}
        color={COLORS.cyan}
        baseRadius={200}
        beatScale={1.3}
        strokeWidth={1.5}
      />
      <PulseRing
        beats={DOWNBEATS}
        color={COLORS.blue}
        baseRadius={280}
        beatScale={1.2}
        strokeWidth={1}
      />

      {/* Orbit dots */}
      <OrbitDots beats={BEATS} dotsPerRing={16} rings={3} baseRadius={240} />

      {/* Center text */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
        }}
      >
        <Glow color={COLORS.pink} intensity={15} pulsate pulseDuration={0.5}>
          <TextAnimation
            key={`${hmrKey}-wave-label`}
            className="text-[56px] font-normal tracking-[0.2em] uppercase"
            style={{
              fontFamily: loadBebasNeue().fontFamily,
              color: COLORS.white,
            }}
            createTimeline={({ textRef, tl, SplitText }) => {
              const split = new SplitText(textRef.current, { type: "chars" });
              tl.fromTo(
                split.chars,
                { opacity: 0, scale: 1.5, filter: "blur(8px)" },
                {
                  opacity: 1,
                  scale: 1,
                  filter: "blur(0px)",
                  duration: 0.5,
                  stagger: 0.04,
                  ease: "power3.out",
                },
              );
              return tl;
            }}
          >
            PULSE
          </TextAnimation>
        </Glow>
      </div>

      <BeatFlash beats={DOWNBEATS} color={COLORS.pink} maxOpacity={0.12} />
      <Particles
        type="sparks"
        count={20}
        speed={0.3}
        colors={[COLORS.pink, COLORS.cyan]}
        seed="wave-sparks"
      />
      <Noise type="grain" intensity={0.2} speed={1} opacity={0.35} />
      <Vignette intensity={0.85} size={0.25} />
    </AbsoluteFill>
  );
};

// ── Scene: Frequency Bars ─────────────────────────────────────────
const FrequencyScene: React.FC = () => {
  const frame = useCurrentFrame();

  const bgShift = Math.sin(frame * 0.015) * 0.3 + 0.5;

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% 60%, ${COLORS.deepPurple}${Math.round(
          bgShift * 35,
        )
          .toString(16)
          .padStart(2, "0")} 0%, ${COLORS.bg} 60%)`,
      }}
    >
      <FloatingShapes beats={BEATS} seed="freq-shapes" count={8} />

      {/* Frequency bars - centered */}
      <FrequencyBars
        beats={BEATS}
        count={56}
        colors={[COLORS.pink, COLORS.cyan]}
        width={1000}
        maxHeight={220}
        x={460}
        y={540}
        mirror
      />

      {/* Title */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "15%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
        }}
      >
        <Glow color={COLORS.cyan} intensity={12} pulsate pulseDuration={0.5}>
          <TextAnimation
            key={`${hmrKey}-freq-label`}
            className="text-[48px] font-normal tracking-[0.25em] uppercase"
            style={{
              fontFamily: loadBebasNeue().fontFamily,
              color: COLORS.white,
            }}
            createTimeline={({ textRef, tl, SplitText }) => {
              const split = new SplitText(textRef.current, { type: "chars" });
              tl.fromTo(
                split.chars,
                { opacity: 0, y: -40, rotationX: -90 },
                {
                  opacity: 1,
                  y: 0,
                  rotationX: 0,
                  duration: 0.7,
                  stagger: 0.05,
                  ease: "back.out(1.7)",
                },
              );
              return tl;
            }}
          >
            FREQUENCY
          </TextAnimation>
        </Glow>
      </div>

      {/* Bottom subtitle */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: "12%",
          transform: "translateX(-50%)",
          opacity: frame >= 15 ? 1 : 0,
        }}
      >
        <TextAnimation
          key={`${hmrKey}-freq-sub`}
          className="text-lg tracking-[0.4em] uppercase"
          style={{
            fontFamily: loadRaleway().fontFamily,
            color: `${COLORS.cyan}90`,
          }}
          startFrom={15}
          createTimeline={({ textRef, tl, SplitText }) => {
            const split = new SplitText(textRef.current, { type: "chars" });
            tl.fromTo(
              split.chars,
              { opacity: 0, x: 20 },
              {
                opacity: 1,
                x: 0,
                duration: 0.4,
                stagger: 0.03,
                ease: "power2.out",
              },
            );
            return tl;
          }}
        >
          SPECTRUM ANALYSIS
        </TextAnimation>
      </div>

      <BeatFlash beats={DOWNBEATS} color={COLORS.cyan} maxOpacity={0.1} />
      <Particles
        type="dust"
        count={25}
        speed={0.2}
        colors={[COLORS.pink + "40", COLORS.cyan + "40"]}
        seed="freq-dust"
      />
      <Noise type="subtle" intensity={0.2} speed={1} opacity={0.3} />
      <Vignette intensity={0.9} size={0.2} />
    </AbsoluteFill>
  );
};

// ── Scene: Final ──────────────────────────────────────────────────
const FinalScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const breathe = Math.sin(frame * 0.025) * 0.3 + 0.5;

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% 50%, ${COLORS.purple}${Math.round(
          breathe * 50,
        )
          .toString(16)
          .padStart(2, "0")} 0%, ${COLORS.bg} 65%)`,
      }}
    >
      <FloatingShapes beats={BEATS} seed="final-shapes" count={12} />

      {/* All visual elements combined */}
      <WaveformCircle
        beats={BEATS}
        radius={120}
        points={64}
        colors={[COLORS.pink, COLORS.blue]}
        seed="final-wave"
      />
      <PulseRing
        beats={BEATS}
        color={COLORS.cyan}
        baseRadius={100}
        beatScale={1.4}
      />
      <PulseRing
        beats={DOWNBEATS}
        color={COLORS.pink}
        baseRadius={170}
        beatScale={1.3}
        strokeWidth={1.5}
      />
      <OrbitDots beats={BEATS} dotsPerRing={10} rings={2} baseRadius={200} />

      {/* Frequency bars - smaller, behind */}
      <div style={{ opacity: 0.4 }}>
        <FrequencyBars
          beats={BEATS}
          count={40}
          colors={[COLORS.purple, COLORS.cyan]}
          width={700}
          maxHeight={120}
          x={610}
          y={540}
          mirror
        />
      </div>

      {/* Center glow orb */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: 200,
          height: 200,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${COLORS.pink}25 0%, transparent 70%)`,
          filter: "blur(30px)",
        }}
      />

      {/* Text */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "43%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
        }}
      >
        <Glow color={COLORS.pink} intensity={25} pulsate pulseDuration={0.5}>
          <TextAnimation
            key={`${hmrKey}-final-title`}
            className="text-[90px] font-normal tracking-[0.12em] uppercase"
            style={{
              fontFamily: loadBebasNeue().fontFamily,
              color: COLORS.white,
            }}
            createTimeline={({ textRef, tl, SplitText }) => {
              const split = new SplitText(textRef.current, { type: "chars" });
              tl.fromTo(
                split.chars,
                { opacity: 0, scale: 2, filter: "blur(15px)" },
                {
                  opacity: 1,
                  scale: 1,
                  filter: "blur(0px)",
                  duration: 0.8,
                  stagger: 0.05,
                  ease: "elastic.out(1, 0.5)",
                },
              );
              return tl;
            }}
          >
            FEEL THE BEAT
          </TextAnimation>
        </Glow>
      </div>

      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "56%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
          opacity: frame >= 20 ? 1 : 0,
        }}
      >
        <TextAnimation
          key={`${hmrKey}-final-sub`}
          className="text-xl tracking-[0.6em] uppercase"
          style={{
            fontFamily: loadRaleway().fontFamily,
            color: `${COLORS.cyan}B0`,
          }}
          startFrom={20}
          createTimeline={({ textRef, tl, SplitText }) => {
            const split = new SplitText(textRef.current, { type: "chars" });
            tl.fromTo(
              split.chars,
              { opacity: 0, y: 15 },
              {
                opacity: 1,
                y: 0,
                duration: 0.5,
                stagger: 0.03,
                ease: "power2.out",
              },
            );
            return tl;
          }}
        >
          IMMERSIVE AUDIO
        </TextAnimation>
      </div>

      <BeatFlash beats={DOWNBEATS} color={COLORS.white} maxOpacity={0.1} />
      <Particles
        type="sparks"
        count={35}
        speed={0.4}
        colors={[COLORS.pink, COLORS.cyan, COLORS.purple, COLORS.blue]}
        seed="final-sparks"
      />
      <Noise type="grain" intensity={0.22} speed={1} opacity={0.35} />
      <Vignette intensity={0.85} size={0.25} />
    </AbsoluteFill>
  );
};

// ── Main Composition ──────────────────────────────────────────────
export const Main: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scene durations (in frames at 30fps)
  const SCENE_1 = 135; // Intro - 4.5s
  const SCENE_2 = 120; // Waveform - 4s
  const SCENE_3 = 120; // Frequency - 4s
  const SCENE_4 = 120; // Final - 4s
  const TRANSITION_DURATION = 20; // ~0.67s transitions

  return (
    <>
      {frame === 0 && (
        <Artifact content={Artifact.Thumbnail} filename="thumbnail.jpeg" />
      )}

      {/* Background music */}
      <Audio src={MUSIC_URL} volume={0.85} />

      {/* Impact sound at start */}
      <Sequence from={0}>
        <Audio src={IMPACT_URL} volume={0.6} />
      </Sequence>

      {/* Whoosh on transitions */}
      <Sequence from={SCENE_1 - TRANSITION_DURATION}>
        <Audio src={WHOOSH_URL} volume={0.35} />
      </Sequence>
      <Sequence from={SCENE_1 + SCENE_2 - 2 * TRANSITION_DURATION}>
        <Audio src={WHOOSH_URL} volume={0.3} />
      </Sequence>
      <Sequence from={SCENE_1 + SCENE_2 + SCENE_3 - 3 * TRANSITION_DURATION}>
        <Audio src={WHOOSH_URL} volume={0.3} />
      </Sequence>

      {/* Scene transitions */}
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={SCENE_1}>
          <IntroScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION_DURATION })}
        />

        <TransitionSeries.Sequence durationInFrames={SCENE_2}>
          <WaveformScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION_DURATION })}
        />

        <TransitionSeries.Sequence durationInFrames={SCENE_3}>
          <FrequencyScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION_DURATION })}
        />

        <TransitionSeries.Sequence durationInFrames={SCENE_4}>
          <FinalScene />
        </TransitionSeries.Sequence>
      </TransitionSeries>

      {/* Global fade out at the end */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: COLORS.bg,
          opacity: interpolate(frame, [435, 460], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          pointerEvents: "none",
          zIndex: 100,
        }}
      />
    </>
  );
};
