import { Suspense, type RefObject } from 'react';
import type { RoleKey } from '@/data/projects';
import { ROLES } from '@/config/roles';
import SceneCanvas from './SceneCanvas';
import Anchored, { type Lean } from './Anchored';
import Particles from './Particles';
import DataGlobe from './DataGlobe';
import NeuralNet from './NeuralNet';
import IntelligenceCore from './IntelligenceCore';
import { Halo, OrbitRings, PortraitPlane } from './PortraitStage';
import { MiniBrain, MiniGlobe, MiniStack } from './MiniScenes';

// Portrait leans toward the hovered card (rotation in radians, offset in portrait-heights).
const LEANS: Record<RoleKey | 'none', Lean> = {
  none: { rx: 0, ry: 0, dx: 0 },
  data: { rx: 0.06, ry: -0.32, dx: -0.05 },
  ai: { rx: 0.14, ry: 0, dx: 0 },
  hybrid: { rx: 0.06, ry: 0.32, dx: 0.05 },
};

const NEUTRAL: [string, string, string] = ['#22d3ee', '#8b5cf6', '#6366f1'];

interface Props {
  active: RoleKey | null;
  portraitAnchor: RefObject<HTMLElement>;
  cardAnchors: Record<RoleKey, RefObject<HTMLElement>>;
  onPortraitReady: () => void;
}

export default function LandingCanvas({ active, portraitAnchor, cardAnchors, onPortraitReady }: Props) {
  const d = ROLES.data.palette;
  const a = ROLES.ai.palette;
  const h = ROLES.hybrid.palette;
  const ringColors: [string, string, string] = active ? [ROLES[active].palette.primary, ROLES[active].palette.accent, ROLES[active].palette.tertiary] : NEUTRAL;

  return (
    <SceneCanvas className="fixed inset-0 z-0" camera={{ position: [0, 0, 10], fov: 40 }}>
      <Particles count={650} color="#a5b4fc" />

      <Anchored anchor={portraitAnchor} lean={LEANS[active ?? 'none']} parallax={0.12}>
        {/* Faint role environment behind the portrait */}
        <group position={[0, 0.08, -0.55]} scale={0.21}>
          <DataGlobe active={active === 'data'} primary={d.primary} accent={d.accent} radius={2.6} columns={false} />
          <group scale={0.9}>
            <NeuralNet active={active === 'ai'} node={a.primary} edge="#a5b4fc" pulse={a.tertiary} />
          </group>
          <IntelligenceCore active={active === 'hybrid'} colors={[h.primary, h.accent, h.tertiary]} />
        </group>
        <Halo color={active ? ROLES[active].palette.primary : '#7c3aed'} />
        <Suspense fallback={null}>
          <PortraitPlane onReady={onPortraitReady} />
        </Suspense>
        <OrbitRings colors={ringColors} />
      </Anchored>

      <Anchored anchor={cardAnchors.data} parallax={0.2} overlay>
        <MiniGlobe active={active === 'data'} color={d.primary} accent={d.accent} />
      </Anchored>
      <Anchored anchor={cardAnchors.ai} parallax={0.2} overlay>
        <MiniBrain active={active === 'ai'} color={a.tertiary} accent="#e879f9" />
      </Anchored>
      <Anchored anchor={cardAnchors.hybrid} parallax={0.2} overlay>
        <MiniStack active={active === 'hybrid'} color={h.tertiary} accent={h.primary} />
      </Anchored>
    </SceneCanvas>
  );
}
