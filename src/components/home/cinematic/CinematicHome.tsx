import { createRef, useMemo, type ReactNode, type RefObject } from 'react';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import './CinematicHome.css';

/**
 * One connected, image-first scroll experience.
 *
 * Structure: a fixed full-viewport backdrop stacks one image per scene. Each scene is a
 * tall block of normal document flow; its own scroll progress (0 = entering from below,
 * 1 = left above) drives the crossfade, zoom, pan and blur-to-focus of its background
 * image and the reveal of its glass panel. Nothing hijacks native scrolling.
 */

export interface SceneDef {
  id: string;
  image: string;
  /** CSS object-position for desktop / mobile. */
  position?: string;
  mobilePosition?: string;
  /** Zoom direction: 'in' grows while scrolling, 'out' settles from a wider shot. */
  zoom?: 'in' | 'out';
  /** Horizontal drift direction while the scene passes. */
  pan?: 'start' | 'end' | 'none';
  /** How tall the scene is, in viewport heights (room for the image to evolve). */
  height?: number;
  /** Where the panel sits on desktop. */
  align?: 'start' | 'end' | 'center';
  /** Soft colour wash at the end of the scene, bleeding into the next. */
  tint?: string;
  content: ReactNode;
}

type Refs = RefObject<HTMLElement>[];

function SceneImage({ scene, target, rtl, reduced }: { scene: SceneDef; target: RefObject<HTMLElement>; rtl: boolean; reduced: boolean }) {
  const { scrollYProgress } = useScroll({ target, offset: ['start end', 'end start'] });
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.5 });

  // Visible while the scene occupies the viewport; cross-fades through neighbours.
  const opacity = useTransform(p, [0, 0.28, 0.72, 1], [0, 1, 1, 0]);
  const zoomIn = scene.zoom !== 'out';
  const scale = useTransform(p, [0, 1], zoomIn ? [1.04, 1.22] : [1.24, 1.04]);
  const panDir = scene.pan === 'none' ? 0 : ((scene.pan ?? 'start') === 'start') !== rtl ? -1 : 1;
  const x = useTransform(p, [0, 1], ['0%', `${panDir * 4}%`]);
  const y = useTransform(p, [0, 1], ['-3%', '3%']);
  const filter = useTransform(p, [0, 0.22, 0.78, 1], ['blur(16px) brightness(.55)', 'blur(0px) brightness(.92)', 'blur(0px) brightness(.8)', 'blur(10px) brightness(.45)']);
  const tintOpacity = useTransform(p, [0.55, 0.95], [0, 1]);

  const style = { '--cine-pos': scene.position ?? '50% 35%', '--cine-pos-mobile': scene.mobilePosition ?? scene.position ?? '50% 30%' } as React.CSSProperties;

  return (
    <motion.div className="cine-bg" style={{ opacity, ...style }} aria-hidden>
      <motion.img src={scene.image} alt="" decoding="async" loading={scene.id === 'hero' ? 'eager' : 'lazy'} style={reduced ? undefined : { scale, x, y, filter }} />
      {scene.tint && <motion.div className="cine-bg-tint" style={{ background: scene.tint, opacity: reduced ? 0.4 : tintOpacity }} />}
    </motion.div>
  );
}

function ScenePanel({ scene, target, reduced }: { scene: SceneDef; target: RefObject<HTMLElement>; reduced: boolean }) {
  const { scrollYProgress } = useScroll({ target, offset: ['start end', 'end start'] });
  const p = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 });
  const opacity = useTransform(p, [0.14, 0.32, 0.72, 0.88], [0, 1, 1, 0]);
  const y = useTransform(p, [0.14, 0.34, 0.72, 0.9], [56, 0, 0, -48]);
  const blur = useTransform(p, [0.14, 0.3, 0.74, 0.88], ['blur(12px)', 'blur(0px)', 'blur(0px)', 'blur(8px)']);
  return (
    <section ref={target} id={scene.id} className={`cine-scene is-${scene.align ?? 'start'}`} style={{ minHeight: `${scene.height ?? 160}vh` }}>
      <div className="cine-sticky">
        <motion.div className="cine-panel" style={reduced ? undefined : { opacity, y, filter: blur }}>
          {scene.content}
        </motion.div>
      </div>
    </section>
  );
}

export function CinematicHome({ scenes, rtl, children }: { scenes: SceneDef[]; rtl: boolean; children?: ReactNode }) {
  const reduced = useReducedMotion() ?? false;
  const refs: Refs = useMemo(() => scenes.map(() => createRef<HTMLElement>() as RefObject<HTMLElement>), [scenes.length]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={`cine-home ${reduced ? 'is-static' : ''}`}>
      <div className="cine-backdrop" aria-hidden>
        {scenes.map((scene, i) => <SceneImage key={scene.id} scene={scene} target={refs[i]} rtl={rtl} reduced={reduced} />)}
        <div className="cine-grain" />
        <div className="cine-vignette" />
      </div>
      <div className="cine-flow">
        {scenes.map((scene, i) => <ScenePanel key={scene.id} scene={scene} target={refs[i]} reduced={reduced} />)}
        {children}
      </div>
    </div>
  );
}
