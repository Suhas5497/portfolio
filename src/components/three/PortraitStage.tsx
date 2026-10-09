import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useLoader } from '@react-three/fiber';
import { PROFILE } from '@/config/profile';
import { getDotTexture, rand, usePointsMaterial, useSceneTime } from './shared';

/** The portrait as a textured plane, so rings can pass genuinely behind and in front of it. */
export function PortraitPlane({ onReady }: { onReady?: () => void }) {
  const tex = useLoader(THREE.TextureLoader, PROFILE.hero.webp);
  const mat = useMemo(() => {
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    return new THREE.MeshBasicMaterial({ map: tex, transparent: true, alphaTest: 0.04, toneMapped: false });
  }, [tex]);
  useEffect(() => onReady?.(), [onReady]);
  const aspect = PROFILE.hero.width / PROFILE.hero.height;
  return (
    <mesh material={mat} renderOrder={1}>
      <planeGeometry args={[aspect, 1]} />
    </mesh>
  );
}

/**
 * Glowing elliptical orbits around the portrait with travelling sparks.
 * Colours ease toward the active role's palette.
 */
export function OrbitRings({ colors }: { colors: [string, string, string] }) {
  const time = useSceneTime();
  const target = useMemo(() => colors.map((c) => new THREE.Color(c)), [colors]);
  const rings = useMemo(
    () =>
      [
        { r: 0.62, tilt: 1.3, yaw: 0.25, y: -0.12, speed: 0.35 },
        { r: 0.72, tilt: 1.38, yaw: -0.35, y: -0.2, speed: -0.25 },
        { r: 0.54, tilt: 1.22, yaw: 0.9, y: 0.02, speed: 0.5 },
      ].map((cfg, i) => {
        const curve = new THREE.EllipseCurve(0, 0, cfg.r, cfg.r, 0, Math.PI * 2, false, 0);
        const pts = curve.getPoints(160).map((p) => new THREE.Vector3(p.x, p.y, 0));
        const geo = new THREE.BufferGeometry().setFromPoints(pts);
        const mat = new THREE.LineBasicMaterial({ color: colors[i], transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false });
        const line = new THREE.Line(geo, mat);
        const sparkGeo = new THREE.BufferGeometry();
        sparkGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(6 * 3), 3));
        const sparkMat = new THREE.PointsMaterial({ size: 0.035, map: getDotTexture(), color: colors[i], transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
        const sparks = new THREE.Points(sparkGeo, sparkMat);
        return { ...cfg, line, mat, sparks, sparkGeo, sparkMat, phases: Array.from({ length: 6 }, () => Math.random()) };
      }),
    // colours handled by easing below; build once
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  const groups = useRef<(THREE.Group | null)[]>([]);

  useFrame(({ clock }, dt) => {
    const t = time(clock);
    const k = Math.min(1, dt * 3) || 1;
    rings.forEach((ring, i) => {
      ring.mat.color.lerp(target[i], k);
      ring.sparkMat.color.copy(ring.mat.color);
      const g = groups.current[i];
      if (g) g.rotation.z = t * ring.speed * 0.3;
      const pos = ring.sparkGeo.attributes.position as THREE.BufferAttribute;
      ring.phases.forEach((ph, j) => {
        const a = (ph + t * ring.speed * 0.25) * Math.PI * 2;
        pos.setXYZ(j, Math.cos(a) * ring.r, Math.sin(a) * ring.r, 0);
      });
      pos.needsUpdate = true;
    });
  });

  return (
    <>
      {rings.map((ring, i) => (
        <group key={i} position={[0, ring.y, 0]} rotation={[ring.tilt, ring.yaw, 0]}>
          <group ref={(el) => (groups.current[i] = el)}>
            <primitive object={ring.line} />
            <primitive object={ring.sparks} />
          </group>
        </group>
      ))}
    </>
  );
}

/** Soft halo + drifting motes behind the portrait. */
export function Halo({ color }: { color: string }) {
  const time = useSceneTime();
  const ref = useRef<THREE.Points>(null);
  const geo = useMemo(() => {
    const n = 140;
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = rand(0.3, 0.75);
      pos.set([Math.cos(a) * r, rand(-0.45, 0.5), Math.sin(a) * r * 0.5 - 0.2], i * 3);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return g;
  }, []);
  const mat = usePointsMaterial(color, 0.018, 0.8);
  const disc = useMemo(
    () => new THREE.MeshBasicMaterial({ map: getDotTexture(), color, transparent: true, opacity: 0.35, depthWrite: false, blending: THREE.AdditiveBlending }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  const target = useMemo(() => new THREE.Color(color), [color]);
  useFrame(({ clock }, dt) => {
    const k = Math.min(1, dt * 3) || 1;
    mat.color.lerp(target, k);
    disc.color.lerp(target, k);
    if (ref.current) ref.current.rotation.y = time(clock) * 0.06;
  });
  return (
    <>
      <mesh material={disc} position={[0, 0.12, -0.3]}>
        <planeGeometry args={[1.25, 1.25]} />
      </mesh>
      <points ref={ref} geometry={geo} material={mat} />
    </>
  );
}
