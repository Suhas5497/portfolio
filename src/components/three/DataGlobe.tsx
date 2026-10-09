import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { rand, usePointsMaterial, useSceneTime, useWeight } from './shared';

interface Props {
  active?: boolean;
  primary?: string;
  accent?: string;
  radius?: number;
  /** Surface "metric columns"; off where the globe is small/background. */
  columns?: boolean;
}

/**
 * Data Analyst environment: a point-cloud globe with data streams arcing
 * between locations, pulses travelling along them, and live "metric" columns.
 * Entirely procedural — no textures or models.
 */
export default function DataGlobe({ active = true, primary = '#3b82f6', accent = '#22d3ee', radius = 2.4, columns: showColumns = true }: Props) {
  const group = useRef<THREE.Group>(null);
  const weight = useWeight(active);
  const time = useSceneTime();

  // Fibonacci-sphere surface points
  const globeGeo = useMemo(() => {
    const n = 1400;
    const pos = new Float32Array(n * 3);
    const ga = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < n; i++) {
      const y = 1 - (i / (n - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      pos.set([Math.cos(ga * i) * r * radius, y * radius, Math.sin(ga * i) * r * radius], i * 3);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return g;
  }, [radius]);
  const globeMat = usePointsMaterial(primary, 0.06, 0.85);

  // Latitude rings for structure
  const rings = useMemo(
    () =>
      [-0.5, 0, 0.5].map((lat) => {
        const r = Math.cos(lat) * radius * 1.002;
        const pts = Array.from({ length: 129 }, (_, i) => {
          const a = (i / 128) * Math.PI * 2;
          return new THREE.Vector3(Math.cos(a) * r, Math.sin(lat) * radius, Math.sin(a) * r);
        });
        return new THREE.BufferGeometry().setFromPoints(pts);
      }),
    [radius],
  );
  const ringMat = useMemo(
    () => new THREE.LineBasicMaterial({ color: primary, transparent: true, opacity: 0.18, depthWrite: false }),
    [primary],
  );

  // Data-stream arcs between random surface points
  const arcs = useMemo(() => {
    const pick = () => {
      const u = Math.random() * 2 - 1;
      const th = Math.random() * Math.PI * 2;
      const r = Math.sqrt(1 - u * u);
      return new THREE.Vector3(Math.cos(th) * r, u, Math.sin(th) * r).multiplyScalar(radius);
    };
    return Array.from({ length: 14 }, () => {
      const a = pick();
      const b = pick();
      const mid = a.clone().add(b).multiplyScalar(0.5);
      mid.setLength(radius + 0.6 + a.distanceTo(b) * 0.35);
      const curve = new THREE.QuadraticBezierCurve3(a, mid, b);
      return { curve, geo: new THREE.BufferGeometry().setFromPoints(curve.getPoints(48)), speed: rand(0.15, 0.4), offset: Math.random() };
    });
  }, [radius]);
  const arcMat = useMemo(
    () => new THREE.LineBasicMaterial({ color: accent, transparent: true, opacity: 0.35, depthWrite: false, blending: THREE.AdditiveBlending }),
    [accent],
  );

  const arcLines = useMemo(() => arcs.map((a) => new THREE.Line(a.geo, arcMat)), [arcs, arcMat]);

  // Pulses travelling along arcs (3 per arc)
  const pulseGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(arcs.length * 3 * 3), 3));
    return g;
  }, [arcs]);
  const pulseMat = usePointsMaterial(accent, 0.2);

  // "Metric columns" rising from the surface
  const columns = useMemo(() => {
    const geo = new THREE.CylinderGeometry(0.02, 0.02, 1, 6);
    geo.translate(0, 0.5, 0);
    const mat = new THREE.MeshBasicMaterial({ color: accent, transparent: true, opacity: 0.8, depthWrite: false });
    const n = 28;
    const mesh = new THREE.InstancedMesh(geo, mat, n);
    const seeds = Array.from({ length: n }, () => {
      const u = Math.random() * 2 - 1;
      const th = Math.random() * Math.PI * 2;
      const r = Math.sqrt(1 - u * u);
      return { dir: new THREE.Vector3(Math.cos(th) * r, u, Math.sin(th) * r), phase: Math.random() * 6 };
    });
    return { mesh, mat, seeds };
  }, [accent]);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const up = useMemo(() => new THREE.Vector3(0, 1, 0), []);
  const tmp = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ clock }) => {
    const t = time(clock);
    const w = weight.current;
    if (!group.current) return;
    group.current.visible = w > 0.01;
    if (!group.current.visible) return;
    group.current.rotation.y = t * 0.08;
    group.current.scale.setScalar(0.85 + 0.15 * w);

    globeMat.opacity = 0.85 * w;
    ringMat.opacity = 0.18 * w;
    arcMat.opacity = 0.35 * w;
    pulseMat.opacity = w;
    columns.mat.opacity = 0.8 * w;

    const pos = pulseGeo.attributes.position as THREE.BufferAttribute;
    arcs.forEach((a, i) => {
      for (let k = 0; k < 3; k++) {
        const p = (t * a.speed + a.offset + k / 3) % 1;
        a.curve.getPoint(p, tmp);
        pos.setXYZ(i * 3 + k, tmp.x, tmp.y, tmp.z);
      }
    });
    pos.needsUpdate = true;

    columns.seeds.forEach((s, i) => {
      const h = 0.06 + 0.26 * (0.5 + 0.5 * Math.sin(t * 1.3 + s.phase));
      dummy.position.copy(s.dir).multiplyScalar(radius);
      dummy.quaternion.setFromUnitVectors(up, s.dir);
      dummy.scale.set(1, h, 1);
      dummy.updateMatrix();
      columns.mesh.setMatrixAt(i, dummy.matrix);
    });
    columns.mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <group ref={group}>
      <points geometry={globeGeo} material={globeMat} />
      {rings.map((g, i) => (
        <lineLoop key={i} geometry={g} material={ringMat} />
      ))}
      {arcLines.map((line, i) => (
        <primitive key={i} object={line} />
      ))}
      <points geometry={pulseGeo} material={pulseMat} />
      {showColumns && <primitive object={columns.mesh} />}
    </group>
  );
}
