import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { rand, usePointsMaterial, useSceneTime } from './shared';

// Small "hologram" scenes for the three landing cards. Each fits in a unit-high
// box (Anchored scales it to the card's visual area). `active` brightens and
// speeds them up when the card is hovered/focused.

function useIntensity(active: boolean) {
  const v = useRef(active ? 1 : 0.55);
  useFrame((_, dt) => {
    v.current += ((active ? 1 : 0.55) - v.current) * Math.min(1, dt * 4);
  });
  return v;
}

/** Data Analyst: point globe with a ring, plus a live bar chart. */
export function MiniGlobe({ active, color = '#3b82f6', accent = '#22d3ee' }: { active: boolean; color?: string; accent?: string }) {
  const time = useSceneTime();
  const k = useIntensity(active);
  const globe = useRef<THREE.Points>(null);
  const geo = useMemo(() => {
    const n = 650;
    const pos = new Float32Array(n * 3);
    const ga = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < n; i++) {
      const y = 1 - (i / (n - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      pos.set([Math.cos(ga * i) * r * 0.3, y * 0.3, Math.sin(ga * i) * r * 0.3], i * 3);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return g;
  }, []);
  const mat = usePointsMaterial(accent, 0.022, 0.95);
  const bars = useMemo(() => {
    const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.85 });
    const geo = new THREE.BoxGeometry(0.06, 1, 0.06);
    geo.translate(0, 0.5, 0);
    return { mat, meshes: Array.from({ length: 6 }, () => new THREE.Mesh(geo, mat)) };
  }, [color]);
  const ringMat = useMemo(() => new THREE.MeshBasicMaterial({ color: accent, transparent: true, opacity: 0.6 }), [accent]);

  useFrame(({ clock }) => {
    const t = time(clock);
    const s = k.current;
    if (globe.current) globe.current.rotation.y = t * 0.4 * s;
    mat.opacity = 0.5 + 0.5 * s;
    bars.mat.opacity = 0.45 + 0.45 * s;
    bars.meshes.forEach((m, i) => {
      m.scale.y = 0.08 + 0.32 * (0.55 + 0.45 * Math.sin(t * 1.6 * s + i * 0.9)) * (0.6 + i * 0.1);
    });
  });

  return (
    <group>
      <group position={[0.22, 0.02, 0]}>
        <points ref={globe} geometry={geo} material={mat} />
        <mesh material={ringMat} rotation={[1.2, 0, 0.3]}>
          <torusGeometry args={[0.38, 0.004, 6, 90]} />
        </mesh>
      </group>
      <group position={[-0.5, -0.3, 0.05]}>
        {bars.meshes.map((m, i) => (
          <primitive key={i} object={m} position={[i * 0.085, 0, 0]} />
        ))}
      </group>
    </group>
  );
}

/** AI/ML: a brain-shaped point cloud with flickering synapse links. */
export function MiniBrain({ active, color = '#a78bfa', accent = '#c084fc' }: { active: boolean; color?: string; accent?: string }) {
  const time = useSceneTime();
  const k = useIntensity(active);
  const ref = useRef<THREE.Group>(null);
  const { geo, lines, lineMat } = useMemo(() => {
    const n = 900;
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i < n; i++) {
      const side = i % 2 ? 1 : -1;
      const u = Math.random() * Math.PI * 2;
      const v = Math.acos(rand(-1, 1));
      const wrinkle = 1 + 0.06 * Math.sin(u * 7 + v * 5);
      const x = side * 0.17 + Math.sin(v) * Math.cos(u) * 0.2 * wrinkle;
      const y = Math.cos(v) * 0.23 * wrinkle;
      const z = Math.sin(v) * Math.sin(u) * 0.3 * wrinkle;
      if (side * x < 0.015) continue; // central fissure
      pts.push(new THREE.Vector3(x, y, z));
    }
    const g = new THREE.BufferGeometry().setFromPoints(pts);
    const seg: number[] = [];
    for (let i = 0; i < 260; i++) {
      const a = pts[Math.floor(Math.random() * pts.length)];
      let best = pts[0];
      let bd = Infinity;
      for (let j = 0; j < 30; j++) {
        const b = pts[Math.floor(Math.random() * pts.length)];
        const d = a.distanceTo(b);
        if (d > 0.02 && d < bd) {
          bd = d;
          best = b;
        }
      }
      seg.push(a.x, a.y, a.z, best.x, best.y, best.z);
    }
    const lg = new THREE.BufferGeometry();
    lg.setAttribute('position', new THREE.Float32BufferAttribute(seg, 3));
    const lm = new THREE.LineBasicMaterial({ color: accent, transparent: true, opacity: 0.4, blending: THREE.AdditiveBlending, depthWrite: false });
    return { geo: g, lines: new THREE.LineSegments(lg, lm), lineMat: lm };
  }, [accent]);
  const mat = usePointsMaterial(color, 0.02, 0.95);

  useFrame(({ clock }) => {
    const t = time(clock);
    const s = k.current;
    if (ref.current) ref.current.rotation.y = Math.sin(t * 0.5) * 0.6 * s;
    lineMat.opacity = (0.15 + 0.35 * (0.5 + 0.5 * Math.sin(t * 4))) * s;
    mat.opacity = 0.5 + 0.5 * s;
  });

  return (
    <group ref={ref} position={[0, 0.02, 0]}>
      <points geometry={geo} material={mat} />
      <primitive object={lines} />
    </group>
  );
}

/** Hybrid: stacked data layers feeding a rotating cube cluster. */
export function MiniStack({ active, color = '#10b981', accent = '#22d3ee' }: { active: boolean; color?: string; accent?: string }) {
  const time = useSceneTime();
  const k = useIntensity(active);
  const layers = useRef<(THREE.Group | null)[]>([]);
  const cluster = useRef<THREE.Group>(null);
  const { box, fill, edgeMat, small, smallEdges } = useMemo(() => {
    const box = new THREE.BoxGeometry(0.34, 0.05, 0.34);
    const fill = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.22, depthWrite: false });
    const edgeMat = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.9 });
    const small = new THREE.BoxGeometry(0.07, 0.07, 0.07);
    const smallEdges = new THREE.EdgesGeometry(small);
    return { box, fill, edgeMat, small, smallEdges };
  }, [color]);
  const edges = useMemo(() => new THREE.EdgesGeometry(box), [box]);
  const cubes = useMemo(() => {
    const out: [number, number, number][] = [];
    for (let x = -1; x <= 1; x++) for (let y = -1; y <= 1; y++) for (let z = -1; z <= 1; z++) if (Math.random() > 0.25) out.push([x * 0.085, y * 0.085, z * 0.085]);
    return out;
  }, []);
  const accentMat = useMemo(() => new THREE.LineBasicMaterial({ color: accent, transparent: true, opacity: 0.9 }), [accent]);
  const accentFill = useMemo(() => new THREE.MeshBasicMaterial({ color: accent, transparent: true, opacity: 0.18, depthWrite: false }), [accent]);

  useFrame(({ clock }) => {
    const t = time(clock);
    const s = k.current;
    layers.current.forEach((g, i) => {
      if (g) g.position.y = -0.24 + i * 0.12 + 0.02 * Math.sin(t * 2 * s - i * 0.8);
    });
    if (cluster.current) {
      cluster.current.rotation.y = t * 0.6 * s;
      cluster.current.rotation.x = t * 0.3 * s;
    }
    edgeMat.opacity = 0.5 + 0.45 * s;
  });

  return (
    <group rotation={[0.35, -0.5, 0]}>
      <group position={[-0.18, 0, 0]}>
        {[0, 1, 2, 3].map((i) => (
          <group key={i} ref={(el) => (layers.current[i] = el)}>
            <mesh geometry={box} material={fill} />
            <lineSegments geometry={edges} material={edgeMat} />
          </group>
        ))}
      </group>
      <group ref={cluster} position={[0.3, 0.02, 0]}>
        {cubes.map((p, i) => (
          <group key={i} position={p}>
            <mesh geometry={small} material={accentFill} />
            <lineSegments geometry={smallEdges} material={accentMat} />
          </group>
        ))}
      </group>
    </group>
  );
}
