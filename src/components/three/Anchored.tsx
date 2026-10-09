import { useEffect, useLayoutEffect, useRef, type ReactNode, type RefObject } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { useSceneMotion } from './SceneCanvas';

export interface Lean {
  rx: number;
  ry: number;
  dx: number;
}

const tmp = new THREE.Vector3();
const dir = new THREE.Vector3();

/** Project a screen point onto the z=0 world plane. */
function screenToWorld(x: number, y: number, w: number, h: number, camera: THREE.Camera) {
  tmp.set((x / w) * 2 - 1, -(y / h) * 2 + 1, 0.5).unproject(camera);
  dir.copy(tmp).sub(camera.position).normalize();
  const t = -camera.position.z / dir.z;
  return { x: camera.position.x + dir.x * t, y: camera.position.y + dir.y * t };
}

/**
 * Pins 3D content to an HTML element: each frame the element's rect is
 * projected to world space, the group is centred on it and scaled so one world
 * unit equals the element's height. Layout stays in CSS (responsive), depth and
 * motion stay in WebGL. `lean` eases rotation/offset (no jumps when it changes).
 */
export default function Anchored({
  anchor,
  children,
  lean,
  parallax = 0,
  overlay = false,
}: {
  anchor: RefObject<HTMLElement>;
  children: ReactNode;
  lean?: Lean;
  parallax?: number;
  /** Draw on top of everything else (ignores depth) — for card scenes over the portrait. */
  overlay?: boolean;
}) {
  const ref = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Group>(null);
  const { camera, size, invalidate } = useThree();
  const { reduced } = useSceneMotion();

  useLayoutEffect(() => {
    if (!overlay || !ref.current) return;
    ref.current.traverse((o) => {
      o.renderOrder = 10;
      const m = (o as THREE.Mesh).material as THREE.Material | THREE.Material[] | undefined;
      (Array.isArray(m) ? m : m ? [m] : []).forEach((mat) => (mat.depthTest = false));
    });
  });

  // Demand-rendered (reduced motion) scenes must re-render when layout moves.
  useEffect(() => {
    if (!reduced) return;
    const on = () => invalidate();
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on);
    return () => {
      window.removeEventListener('scroll', on);
      window.removeEventListener('resize', on);
    };
  }, [reduced, invalidate]);

  useFrame(({ pointer }, dt) => {
    const g = ref.current;
    const el = anchor.current;
    if (!g || !el) return;
    const r = el.getBoundingClientRect();
    const visible = r.bottom > -50 && r.top < size.height + 50 && r.width > 0;
    g.visible = visible;
    if (!visible) return;
    const top = screenToWorld(r.left + r.width / 2, r.top, size.width, size.height, camera);
    const bottom = screenToWorld(r.left + r.width / 2, r.bottom, size.width, size.height, camera);
    g.position.set(top.x, (top.y + bottom.y) / 2, 0);
    g.scale.setScalar(Math.max(0.001, top.y - bottom.y));

    const i = inner.current;
    if (!i) return;
    const k = reduced ? 1 : Math.min(1, dt * 4);
    const ry = (lean?.ry ?? 0) + (reduced ? 0 : pointer.x * parallax);
    const rx = (lean?.rx ?? 0) + (reduced ? 0 : -pointer.y * parallax * 0.6);
    i.rotation.y += (ry - i.rotation.y) * k;
    i.rotation.x += (rx - i.rotation.x) * k;
    i.position.x += ((lean?.dx ?? 0) - i.position.x) * k;
  });

  return (
    <group ref={ref}>
      <group ref={inner}>{children}</group>
    </group>
  );
}
