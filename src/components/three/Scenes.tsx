import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import type { RoleKey } from '@/data/projects';
import { ROLES } from '@/config/roles';
import DataGlobe from './DataGlobe';
import NeuralNet from './NeuralNet';
import IntelligenceCore from './IntelligenceCore';
import Particles from './Particles';
import { useSceneMotion } from './SceneCanvas';

/** Eases a group toward `x` and tilts it with the pointer — no jumps on retarget. */
function Follow({ x = 0, y = 0, scale = 1, children }: { x?: number; y?: number; scale?: number; children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null);
  const { reduced } = useSceneMotion();
  useFrame(({ pointer }, dt) => {
    const g = ref.current;
    if (!g) return;
    const k = reduced ? 1 : Math.min(1, dt * 2.4);
    g.position.x += (x - g.position.x) * k;
    g.position.y += (y - g.position.y) * k;
    const s = g.scale.x + (scale - g.scale.x) * k;
    g.scale.setScalar(s);
    if (!reduced) {
      g.rotation.y += (pointer.x * 0.25 - g.rotation.y) * Math.min(1, dt * 2);
      g.rotation.x += (-pointer.y * 0.15 - g.rotation.x) * Math.min(1, dt * 2);
    }
  });
  return (
    <group ref={ref} position={[x, y, 0]} scale={scale}>
      {children}
    </group>
  );
}

/** Role hero: the single environment for that experience. */
export function RoleScene({ role }: { role: RoleKey }) {
  const p = ROLES[role].palette;
  return (
    <>
      <Particles count={350} color={p.tertiary} spread={12} />
      <Follow>
        {role === 'data' && <DataGlobe primary={p.primary} accent={p.accent} radius={2.5} />}
        {role === 'ai' && (
          <group scale={0.92}>
            <NeuralNet node={p.primary} edge="#a5b4fc" pulse={p.tertiary} />
          </group>
        )}
        {role === 'hybrid' && <IntelligenceCore colors={[p.primary, p.accent, p.tertiary]} />}
      </Follow>
    </>
  );
}
