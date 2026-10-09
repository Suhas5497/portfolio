import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { rand, usePointsMaterial, useSceneTime, useWeight } from './shared';

interface Props {
  active?: boolean;
  colors?: [string, string, string];
}

/**
 * Hybrid environment: an "intelligence core". Data particles stream inward from
 * the outside (data), pass through orbiting model rings (prediction), and
 * emerge as bright decision sparks along the axis (action).
 */
export default function IntelligenceCore({ active = true, colors = ['#22d3ee', '#8b5cf6', '#10b981'] }: Props) {
  const group = useRef<THREE.Group>(null);
  const shell = useRef<THREE.Mesh>(null);
  const inner = useRef<THREE.Mesh>(null);
  const ringRefs = useRef<(THREE.Group | null)[]>([]);
  const weight = useWeight(active);
  const time = useSceneTime();
  const [cData, cModel, cAction] = colors;

  const shellMat = useMemo(() => new THREE.MeshBasicMaterial({ color: cModel, wireframe: true, transparent: true, opacity: 0.25 }), [cModel]);
  const innerMat = useMemo(
    () => new THREE.MeshBasicMaterial({ color: cData, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false }),
    [cData],
  );

  const rings = useMemo(
    () =>
      [
        { r: 1.9, tilt: [0.4, 0, 0.2], color: cData, speed: 0.45 },
        { r: 2.35, tilt: [-0.6, 0.3, 0], color: cModel, speed: -0.32 },
        { r: 2.8, tilt: [1.2, -0.2, 0.4], color: cAction, speed: 0.24 },
      ].map((ring) => {
        const torusMat = new THREE.MeshBasicMaterial({ color: ring.color, transparent: true, opacity: 0.55 });
        const nodeMat = new THREE.MeshBasicMaterial({ color: ring.color, transparent: true });
        return { ...ring, torusMat, nodeMat, nodes: Array.from({ length: 4 }, (_, i) => (i / 4) * Math.PI * 2) };
      }),
    [cData, cModel, cAction],
  );

  // Inward data stream
  const N = 260;
  const stream = useMemo(
    () =>
      Array.from({ length: N }, () => {
        const dir = new THREE.Vector3(rand(-1, 1), rand(-1, 1), rand(-1, 1)).normalize();
        return { dir, p: Math.random(), s: rand(0.12, 0.3) };
      }),
    [],
  );
  const streamGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(N * 3), 3));
    return g;
  }, []);
  const streamMat = usePointsMaterial(cData, 0.09, 0.9);

  // Outward decision sparks along the vertical axis
  const S = 40;
  const sparks = useMemo(() => Array.from({ length: S }, () => ({ p: Math.random(), s: rand(0.25, 0.5), side: Math.random() < 0.5 ? -1 : 1, jitter: rand(-0.15, 0.15) })), []);
  const sparkGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(S * 3), 3));
    return g;
  }, []);
  const sparkMat = usePointsMaterial(cAction, 0.2);
  const last = useRef(0);

  useFrame(({ clock }) => {
    const t = time(clock);
    const dt = Math.min(0.05, Math.max(0, t - last.current));
    last.current = t;
    const w = weight.current;
    if (!group.current) return;
    group.current.visible = w > 0.01;
    if (!group.current.visible) return;
    group.current.scale.setScalar(0.85 + 0.15 * w);

    if (shell.current) {
      shell.current.rotation.y = t * 0.15;
      shell.current.rotation.x = t * 0.07;
    }
    if (inner.current) inner.current.scale.setScalar(1 + 0.08 * Math.sin(t * 2.2));
    shellMat.opacity = 0.25 * w;
    innerMat.opacity = 0.55 * w;

    rings.forEach((ring, i) => {
      const g = ringRefs.current[i];
      if (g) g.rotation.z = t * ring.speed;
      ring.torusMat.opacity = 0.55 * w;
      ring.nodeMat.opacity = w;
    });

    const sp = streamGeo.attributes.position as THREE.BufferAttribute;
    stream.forEach((q, i) => {
      q.p += dt * q.s;
      if (q.p > 1) q.p -= 1;
      const r = 5.2 * (1 - q.p) + 0.7;
      sp.setXYZ(i, q.dir.x * r, q.dir.y * r, q.dir.z * r);
    });
    sp.needsUpdate = true;
    streamMat.opacity = 0.9 * w;

    const kp = sparkGeo.attributes.position as THREE.BufferAttribute;
    sparks.forEach((q, i) => {
      q.p += dt * q.s;
      if (q.p > 1) q.p -= 1;
      kp.setXYZ(i, q.jitter + Math.sin(q.p * 9) * 0.08, q.side * (0.8 + q.p * 3.4), q.jitter);
    });
    kp.needsUpdate = true;
    sparkMat.opacity = w;
  });

  return (
    <group ref={group}>
      <mesh ref={shell} material={shellMat}>
        <icosahedronGeometry args={[1.25, 1]} />
      </mesh>
      <mesh ref={inner} material={innerMat}>
        <sphereGeometry args={[0.62, 32, 32]} />
      </mesh>
      {rings.map((ring, i) => (
        <group key={i} rotation={ring.tilt as [number, number, number]}>
          <group ref={(el) => (ringRefs.current[i] = el)}>
            <mesh material={ring.torusMat}>
              <torusGeometry args={[ring.r, 0.012, 8, 120]} />
            </mesh>
            {ring.nodes.map((a, k) => (
              <mesh key={k} position={[Math.cos(a) * ring.r, Math.sin(a) * ring.r, 0]} material={ring.nodeMat}>
                <sphereGeometry args={[0.07, 12, 12]} />
              </mesh>
            ))}
          </group>
        </group>
      ))}
      <points geometry={streamGeo} material={streamMat} />
      <points geometry={sparkGeo} material={sparkMat} />
    </group>
  );
}
