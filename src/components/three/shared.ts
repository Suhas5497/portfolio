import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { useEffect } from 'react';
import { useSceneMotion } from './SceneCanvas';

let dotTex: THREE.Texture | null = null;

/** Procedural soft-dot sprite (no image assets needed). */
export function getDotTexture(): THREE.Texture {
  if (dotTex) return dotTex;
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d')!;
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, 'rgba(255,255,255,1)');
  grad.addColorStop(0.35, 'rgba(255,255,255,0.75)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
  dotTex = new THREE.CanvasTexture(c);
  dotTex.colorSpace = THREE.SRGBColorSpace;
  return dotTex;
}

export const rand = (a: number, b: number) => a + Math.random() * (b - a);

/**
 * Smoothly eases a 0..1 weight toward `active`. Under reduced motion the weight
 * snaps and a single frame is requested, so scenes never jump mid-animation
 * but also never animate for users who opted out.
 */
export function useWeight(active: boolean, speed = 2.2) {
  const { reduced } = useSceneMotion();
  const invalidate = useThree((s) => s.invalidate);
  const w = useRef(active ? 1 : 0);
  if (reduced) w.current = active ? 1 : 0;
  useEffect(() => {
    if (reduced) invalidate();
  }, [active, reduced, invalidate]);
  useFrame((_, dt) => {
    const t = active ? 1 : 0;
    w.current += (t - w.current) * Math.min(1, dt * speed);
  });
  return w;
}

/** Fixed time for reduced-motion frames so scenes render a pleasant still. */
export function useSceneTime() {
  const { reduced } = useSceneMotion();
  return (clock: THREE.Clock) => (reduced ? 2.5 : clock.getElapsedTime());
}

export function usePointsMaterial(color: string, size: number, opacity = 1) {
  return useMemo(
    () =>
      new THREE.PointsMaterial({
        size,
        map: getDotTexture(),
        color,
        transparent: true,
        opacity,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
      }),
    [color, size, opacity],
  );
}
