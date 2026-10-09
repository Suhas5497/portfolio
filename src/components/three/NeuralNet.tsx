import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { rand, usePointsMaterial, useSceneTime, useWeight } from './shared';

interface Props {
  active?: boolean;
  layers?: number[];
  node?: string;
  edge?: string;
  pulse?: string;
  spacingX?: number;
  spreadY?: number;
  pulses?: number;
  /** Animate a "training" breathing of edge weights. */
  training?: boolean;
}

/**
 * AI/ML environment: a layered neural network. Signals propagate forward edge
 * by edge; nodes light up when a signal arrives; edge opacity "breathes" to
 * suggest weights updating during training.
 */
export default function NeuralNet({
  active = true,
  layers = [5, 8, 10, 8, 4, 2],
  node = '#8b5cf6',
  edge = '#a5b4fc',
  pulse = '#c084fc',
  spacingX = 1.25,
  spreadY = 4.2,
  pulses = 60,
  training = true,
}: Props) {
  const group = useRef<THREE.Group>(null);
  const weight = useWeight(active);
  const time = useSceneTime();

  const net = useMemo(() => {
    const nodes: THREE.Vector3[] = [];
    const byLayer: number[][] = [];
    const width = (layers.length - 1) * spacingX;
    layers.forEach((count, li) => {
      const ids: number[] = [];
      for (let j = 0; j < count; j++) {
        const y = count === 1 ? 0 : (j / (count - 1) - 0.5) * spreadY * Math.min(1, count / 6 + 0.35);
        const z = Math.sin(j * 1.9 + li) * 0.9;
        ids.push(nodes.length);
        nodes.push(new THREE.Vector3(li * spacingX - width / 2, y, z));
      }
      byLayer.push(ids);
    });
    const edges: [number, number][] = [];
    const out: number[][] = nodes.map(() => []);
    for (let li = 0; li < byLayer.length - 1; li++) {
      for (const a of byLayer[li]) for (const b of byLayer[li + 1]) {
        out[a].push(edges.length);
        edges.push([a, b]);
      }
    }
    return { nodes, byLayer, edges, out };
  }, [layers, spacingX, spreadY]);

  const edgeObj = useMemo(() => {
    const pos = new Float32Array(net.edges.length * 6);
    const col = new Float32Array(net.edges.length * 6);
    net.edges.forEach(([a, b], i) => {
      net.nodes[a].toArray(pos, i * 6);
      net.nodes[b].toArray(pos, i * 6 + 3);
    });
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    const m = new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.5, depthWrite: false, blending: THREE.AdditiveBlending });
    return { line: new THREE.LineSegments(g, m), col, mat: m, phases: net.edges.map(() => Math.random() * 6) };
  }, [net]);

  const nodeObj = useMemo(() => {
    const mat = new THREE.MeshBasicMaterial({ transparent: true });
    const mesh = new THREE.InstancedMesh(new THREE.SphereGeometry(0.11, 14, 14), mat, net.nodes.length);
    return { mesh, mat };
  }, [net]);

  const haloGeo = useMemo(() => new THREE.BufferGeometry().setFromPoints(net.nodes), [net]);
  const haloMat = usePointsMaterial(node, 0.85, 0.35);

  const pulseState = useMemo(
    () => Array.from({ length: pulses }, () => ({ e: Math.floor(Math.random() * net.edges.length), p: Math.random(), s: rand(0.6, 1.3) })),
    [pulses, net],
  );
  const pulseGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(pulses * 3), 3));
    return g;
  }, [pulses]);
  const pulseMat = usePointsMaterial(pulse, 0.36);

  const heat = useMemo(() => new Float32Array(net.nodes.length), [net]);
  const cBase = useMemo(() => new THREE.Color(node), [node]);
  const cHot = useMemo(() => new THREE.Color(pulse), [pulse]);
  const cEdge = useMemo(() => new THREE.Color(edge), [edge]);
  const c = useMemo(() => new THREE.Color(), []);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const v = useMemo(() => new THREE.Vector3(), []);
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

    // Forward propagation of pulses
    const pos = pulseGeo.attributes.position as THREE.BufferAttribute;
    pulseState.forEach((q, i) => {
      q.p += dt * q.s;
      if (q.p >= 1) {
        const target = net.edges[q.e][1];
        heat[target] = 1;
        const next = net.out[target];
        if (next.length) q.e = next[Math.floor(Math.random() * next.length)];
        else {
          const first = net.byLayer[0][Math.floor(Math.random() * net.byLayer[0].length)];
          q.e = net.out[first][Math.floor(Math.random() * net.out[first].length)];
        }
        q.p = 0;
      }
      const [a, b] = net.edges[q.e];
      v.copy(net.nodes[a]).lerp(net.nodes[b], q.p);
      pos.setXYZ(i, v.x, v.y, v.z);
    });
    pos.needsUpdate = true;
    pulseMat.opacity = w;

    // Nodes heat up on arrival
    for (let i = 0; i < net.nodes.length; i++) {
      heat[i] = Math.max(0, heat[i] - dt * 1.6);
      c.copy(cBase).lerp(cHot, heat[i]);
      nodeObj.mesh.setColorAt(i, c);
      dummy.position.copy(net.nodes[i]);
      dummy.scale.setScalar(1 + heat[i] * 0.6);
      dummy.updateMatrix();
      nodeObj.mesh.setMatrixAt(i, dummy.matrix);
    }
    nodeObj.mesh.instanceMatrix.needsUpdate = true;
    if (nodeObj.mesh.instanceColor) nodeObj.mesh.instanceColor.needsUpdate = true;
    nodeObj.mat.opacity = w;
    haloMat.opacity = 0.35 * w;

    // Edge "weights" breathing as if training
    const col = edgeObj.col;
    for (let i = 0; i < net.edges.length; i++) {
      const k = training ? 0.12 + 0.2 * (0.5 + 0.5 * Math.sin(t * 0.9 + edgeObj.phases[i])) : 0.18;
      c.copy(cEdge).multiplyScalar(k);
      col[i * 6] = col[i * 6 + 3] = c.r;
      col[i * 6 + 1] = col[i * 6 + 4] = c.g;
      col[i * 6 + 2] = col[i * 6 + 5] = c.b;
    }
    (edgeObj.line.geometry.attributes.color as THREE.BufferAttribute).needsUpdate = true;
    edgeObj.mat.opacity = w;
  });

  return (
    <group ref={group}>
      <primitive object={edgeObj.line} />
      <primitive object={nodeObj.mesh} />
      <points geometry={haloGeo} material={haloMat} />
      <points geometry={pulseGeo} material={pulseMat} />
    </group>
  );
}
