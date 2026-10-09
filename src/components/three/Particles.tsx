import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { rand, usePointsMaterial, useSceneTime } from './shared';

/** Subtle ambient particle field drifting slowly in depth. */
export default function Particles({ count = 600, color = '#c4b5fd', spread = 16 }: { count?: number; color?: string; spread?: number }) {
  const ref = useRef<THREE.Points>(null);
  const time = useSceneTime();
  const geo = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) pos.set([rand(-spread, spread), rand(-spread * 0.6, spread * 0.6), rand(-spread, 2)], i * 3);
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return g;
  }, [count, spread]);
  const mat = usePointsMaterial(color, 0.05, 0.5);

  useFrame(({ clock, pointer }) => {
    if (!ref.current) return;
    const t = time(clock);
    ref.current.rotation.y = t * 0.01 + pointer.x * 0.05;
    ref.current.rotation.x = pointer.y * 0.03;
  });

  return <points ref={ref} geometry={geo} material={mat} />;
}
