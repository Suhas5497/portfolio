import { Component, createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import { AdaptiveDpr } from '@react-three/drei';
import { hasWebGL } from '@/lib/webgl';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/** Lets scene components snap instead of animate when motion is reduced. */
export const MotionContext = createContext({ reduced: false });
export const useSceneMotion = () => useContext(MotionContext);

class CanvasBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(err: unknown) {
    console.warn('3D scene disabled:', err);
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

/** Static gradient shown when WebGL is unavailable or the scene crashes. */
export function SceneFallback({ label }: { label?: string }) {
  return (
    <div className="absolute inset-0 overflow-hidden" data-scene-fallback aria-hidden="true" title={label}>
      <div className="absolute inset-[10%] rounded-full bg-[radial-gradient(circle,rgb(var(--c-primary)/0.35),rgb(var(--c-accent)/0.12)_45%,transparent_70%)] blur-2xl" />
      <div className="absolute inset-0 grid-overlay opacity-60" />
    </div>
  );
}

interface Props {
  children: ReactNode;
  className?: string;
  camera?: { position: [number, number, number]; fov?: number };
  label?: string;
}

/**
 * Canvas wrapper: WebGL detection + error boundary fallback, capped DPR,
 * demand rendering under reduced motion, and paused rendering off-screen.
 */
export default function SceneCanvas({ children, className = '', camera = { position: [0, 0, 10], fov: 45 }, label }: Props) {
  const reduced = useReducedMotion();
  const wrap = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const [webgl] = useState(() => hasWebGL());

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: '100px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const fallback = <SceneFallback label={label} />;

  return (
    // Caller controls positioning (absolute/fixed); default to relative so the canvas has a box.
    <div ref={wrap} className={className || 'relative'} aria-hidden={label ? undefined : true} data-scene={webgl ? 'webgl' : 'fallback'}>
      {webgl ? (
        <CanvasBoundary fallback={fallback}>
          <MotionContext.Provider value={{ reduced }}>
            <Canvas
              camera={{ position: camera.position, fov: camera.fov ?? 45, near: 0.1, far: 200 }}
              dpr={[1, 1.75]}
              gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
              frameloop={reduced ? 'demand' : visible ? 'always' : 'never'}
              style={{ position: 'absolute', inset: 0 }}
            >
              <AdaptiveDpr pixelated={false} />
              {children}
            </Canvas>
          </MotionContext.Provider>
        </CanvasBoundary>
      ) : (
        fallback
      )}
    </div>
  );
}
