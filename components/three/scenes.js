import { dotTexture } from './ThreeCanvas';

// ── Shared helpers ────────────────────────────────────────────────────────────
const rand = (a, b) => a + Math.random() * (b - a);
const gauss = () => {
  let u = 0, v = 0;
  while (!u) u = Math.random();
  while (!v) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
};

function addLights(THREE, scene, a, b) {
  scene.add(new THREE.AmbientLight(0xffffff, 0.55));
  const d = new THREE.DirectionalLight(0xffffff, 1.1);
  d.position.set(5, 10, 7);
  scene.add(d);
  const p1 = new THREE.PointLight(a, 30, 30);
  p1.position.set(-6, 4, 4);
  scene.add(p1);
  const p2 = new THREE.PointLight(b, 30, 30);
  p2.position.set(6, -2, 5);
  scene.add(p2);
}

function tiltWithMouse(group, ctx, dt, base = { x: 0.25, y: 0 }, strength = 0.25) {
  const k = Math.min(1, dt * 2.5);
  group.rotation.x += (base.x - ctx.mouse.y * strength - group.rotation.x) * k;
  group.userData.yOffset = (group.userData.yOffset || 0) + (ctx.mouse.x * strength - (group.userData.yOffset || 0)) * k;
}

// Animated 3D bar chart — heights follow travelling waves like live metrics.
function makeBars(THREE, { n = 9, gap = 0.75, low, high }) {
  const geo = new THREE.BoxGeometry(gap * 0.68, 1, gap * 0.68);
  geo.translate(0, 0.5, 0);
  const mat = new THREE.MeshStandardMaterial({ roughness: 0.35, metalness: 0.25, emissive: 0x111122, emissiveIntensity: 0.4 });
  const mesh = new THREE.InstancedMesh(geo, mat, n * n);
  const dummy = new THREE.Object3D();
  const cLow = new THREE.Color(low);
  const cHigh = new THREE.Color(high);
  const tmp = new THREE.Color();
  const seeds = Array.from({ length: n * n }, () => Math.random() * Math.PI * 2);
  const off = ((n - 1) * gap) / 2;

  const update = (t) => {
    let i = 0;
    for (let x = 0; x < n; x++) {
      for (let z = 0; z < n; z++) {
        const h =
          0.35 +
          1.1 * (0.5 + 0.5 * Math.sin(x * 0.7 + t * 1.1)) * (0.5 + 0.5 * Math.cos(z * 0.6 - t * 0.8)) +
          0.35 * (0.5 + 0.5 * Math.sin(t * 1.7 + seeds[i])) +
          0.08 * (x + z);
        dummy.position.set(x * gap - off, 0, z * gap - off);
        dummy.scale.set(1, h, 1);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
        tmp.copy(cLow).lerp(cHigh, Math.min(1, (h - 0.35) / 2.2));
        mesh.setColorAt(i, tmp);
        i++;
      }
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  };
  update(0);
  return { mesh, update, size: n * gap };
}

// Layered neural network with signal pulses propagating forward along edges.
function makeNetwork(THREE, { layers, spacingX = 1.6, spreadY = 3.2, spreadZ = 1.2, node, edge, pulse, pulses = 40, tex }) {
  const group = new THREE.Group();
  const nodes = [];
  const byLayer = [];
  const width = (layers.length - 1) * spacingX;
  layers.forEach((count, li) => {
    const ids = [];
    for (let j = 0; j < count; j++) {
      const y = count === 1 ? 0 : (j / (count - 1) - 0.5) * spreadY * Math.min(1, count / 6 + 0.35);
      const z = Math.sin(j * 1.9 + li) * spreadZ * 0.5;
      ids.push(nodes.length);
      nodes.push(new THREE.Vector3(li * spacingX - width / 2, y, z));
    }
    byLayer.push(ids);
  });

  const edges = [];
  const outEdges = nodes.map(() => []);
  for (let li = 0; li < byLayer.length - 1; li++) {
    byLayer[li].forEach((a) => byLayer[li + 1].forEach((b) => {
      outEdges[a].push(edges.length);
      edges.push([a, b]);
    }));
  }

  const edgePos = new Float32Array(edges.length * 6);
  edges.forEach(([a, b], i) => {
    nodes[a].toArray(edgePos, i * 6);
    nodes[b].toArray(edgePos, i * 6 + 3);
  });
  const edgeGeo = new THREE.BufferGeometry();
  edgeGeo.setAttribute('position', new THREE.BufferAttribute(edgePos, 3));
  group.add(new THREE.LineSegments(edgeGeo, new THREE.LineBasicMaterial({ color: edge, transparent: true, opacity: 0.16, blending: THREE.AdditiveBlending, depthWrite: false })));

  const sphere = new THREE.SphereGeometry(0.12, 16, 16);
  const nodeMesh = new THREE.InstancedMesh(sphere, new THREE.MeshBasicMaterial({ color: 0xffffff }), nodes.length);
  const dummy = new THREE.Object3D();
  const base = new THREE.Color(node);
  const hot = new THREE.Color(pulse);
  const tmp = new THREE.Color();
  nodes.forEach((p, i) => {
    dummy.position.copy(p);
    dummy.updateMatrix();
    nodeMesh.setMatrixAt(i, dummy.matrix);
    nodeMesh.setColorAt(i, base);
  });
  group.add(nodeMesh);

  // Halo sprites around nodes
  const haloGeo = new THREE.BufferGeometry().setFromPoints(nodes);
  group.add(new THREE.Points(haloGeo, new THREE.PointsMaterial({ size: 0.9, map: tex, color: node, transparent: true, opacity: 0.35, blending: THREE.AdditiveBlending, depthWrite: false })));

  // Pulses
  const pulsePos = new Float32Array(pulses * 3);
  const pulseGeo = new THREE.BufferGeometry();
  pulseGeo.setAttribute('position', new THREE.BufferAttribute(pulsePos, 3));
  group.add(new THREE.Points(pulseGeo, new THREE.PointsMaterial({ size: 0.42, map: tex, color: pulse, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false })));

  const startEdge = () => outEdges[byLayer[0][Math.floor(Math.random() * byLayer[0].length)]][Math.floor(Math.random() * outEdges[byLayer[0][0]].length)];
  const ps = Array.from({ length: pulses }, () => ({ e: Math.floor(Math.random() * edges.length), p: Math.random(), s: rand(0.6, 1.3) }));
  const heat = new Float32Array(nodes.length);
  const v = new THREE.Vector3();

  const update = (t, dt) => {
    ps.forEach((q, i) => {
      q.p += dt * q.s;
      if (q.p >= 1) {
        const target = edges[q.e][1];
        heat[target] = 1;
        const next = outEdges[target];
        q.e = next.length ? next[Math.floor(Math.random() * next.length)] : startEdge();
        q.p = 0;
      }
      const [a, b] = edges[q.e];
      v.copy(nodes[a]).lerp(nodes[b], q.p);
      v.toArray(pulsePos, i * 3);
    });
    pulseGeo.attributes.position.needsUpdate = true;
    for (let i = 0; i < nodes.length; i++) {
      heat[i] = Math.max(0, heat[i] - dt * 1.6);
      tmp.copy(base).lerp(hot, heat[i]);
      nodeMesh.setColorAt(i, tmp);
      dummy.position.copy(nodes[i]);
      dummy.scale.setScalar(1 + heat[i] * 0.6 + 0.08 * Math.sin(t * 2 + i));
      dummy.updateMatrix();
      nodeMesh.setMatrixAt(i, dummy.matrix);
    }
    nodeMesh.instanceMatrix.needsUpdate = true;
    nodeMesh.instanceColor.needsUpdate = true;
  };
  update(0, 0);
  return { group, nodes, byLayer, update };
}

// ── Data Analyst: live 3D bar chart + streaming trend line + k-means clusters ─
export function buildDataScene(THREE, ctx) {
  const { scene, camera } = ctx;
  const tex = dotTexture(THREE);
  addLights(THREE, scene, 0x10b981, 0x38bdf8);
  camera.position.set(0, 4.2, 11.5);
  camera.lookAt(0, 0.6, 0);

  const root = new THREE.Group();
  scene.add(root);

  const bars = makeBars(THREE, { n: 9, gap: 0.62, low: 0x0e7490, high: 0x34d399 });
  root.add(bars.mesh);

  const grid = new THREE.GridHelper(8, 16, 0x34d399, 0x1e293b);
  grid.material.transparent = true;
  grid.material.opacity = 0.25;
  root.add(grid);

  // Streaming trend line floating above the chart
  const N = 90;
  const linePos = new Float32Array(N * 3);
  const lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute('position', new THREE.BufferAttribute(linePos, 3));
  const line = new THREE.Line(lineGeo, new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.9 }));
  root.add(line);
  const lineDots = new THREE.Points(lineGeo, new THREE.PointsMaterial({ size: 0.12, map: tex, color: 0x7dd3fc, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
  root.add(lineDots);

  // Three gaussian clusters orbiting — a nod to segmentation / clustering
  const clusterColors = [0x34d399, 0x38bdf8, 0xfbbf24];
  const clusters = clusterColors.map((c, k) => {
    const M = 70;
    const pos = new Float32Array(M * 3);
    for (let i = 0; i < M; i++) {
      pos[i * 3] = gauss() * 0.32;
      pos[i * 3 + 1] = gauss() * 0.32;
      pos[i * 3 + 2] = gauss() * 0.32;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const pts = new THREE.Points(g, new THREE.PointsMaterial({ size: 0.16, map: tex, color: c, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false }));
    const centroid = new THREE.Mesh(new THREE.OctahedronGeometry(0.11), new THREE.MeshBasicMaterial({ color: c }));
    const holder = new THREE.Group();
    holder.add(pts, centroid);
    holder.userData.phase = (k / 3) * Math.PI * 2;
    root.add(holder);
    return holder;
  });

  return (t, dt) => {
    bars.update(t);
    for (let i = 0; i < N; i++) {
      const x = (i / (N - 1) - 0.5) * 6.4;
      const s = i * 0.11 + t * 1.4;
      const y = 3.1 + 0.45 * Math.sin(s) + 0.25 * Math.sin(s * 2.3 + 1) + 0.012 * i;
      linePos[i * 3] = x;
      linePos[i * 3 + 1] = y;
      linePos[i * 3 + 2] = -2.6;
    }
    lineGeo.attributes.position.needsUpdate = true;
    clusters.forEach((c) => {
      const a = c.userData.phase + t * 0.35;
      c.position.set(Math.cos(a) * 4.2, 1.6 + Math.sin(a * 2) * 0.4, Math.sin(a) * 4.2);
      c.rotation.y = t * 0.6;
    });
    tiltWithMouse(root, ctx, dt, { x: 0 }, 0.18);
    root.rotation.y = t * 0.12 + root.userData.yOffset;
  };
}

// ── AI/ML: neural network with forward-propagating signals inside a wireframe core
export function buildAIScene(THREE, ctx) {
  const { scene, camera } = ctx;
  const tex = dotTexture(THREE);
  camera.position.set(0, 0.3, 11);

  const root = new THREE.Group();
  scene.add(root);

  const net = makeNetwork(THREE, {
    layers: [5, 8, 10, 8, 4, 2],
    spacingX: 1.35,
    spreadY: 4.4,
    spreadZ: 2.2,
    node: 0xa855f7,
    edge: 0xc084fc,
    pulse: 0xf472b6,
    pulses: 70,
    tex,
  });
  root.add(net.group);

  const core = new THREE.Mesh(
    new THREE.IcosahedronGeometry(4.3, 1),
    new THREE.MeshBasicMaterial({ color: 0x7c3aed, wireframe: true, transparent: true, opacity: 0.07 }),
  );
  root.add(core);

  // Drifting "embedding space" particles
  const M = 500;
  const pos = new Float32Array(M * 3);
  for (let i = 0; i < M; i++) {
    const r = rand(4.5, 7.5);
    const th = Math.random() * Math.PI * 2;
    const ph = Math.acos(rand(-1, 1));
    pos[i * 3] = r * Math.sin(ph) * Math.cos(th);
    pos[i * 3 + 1] = r * Math.cos(ph) * 0.7;
    pos[i * 3 + 2] = r * Math.sin(ph) * Math.sin(th);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const dust = new THREE.Points(g, new THREE.PointsMaterial({ size: 0.09, map: tex, color: 0xe9d5ff, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending, depthWrite: false }));
  scene.add(dust);

  return (t, dt) => {
    net.update(t, dt);
    core.rotation.y = t * 0.08;
    core.rotation.x = t * 0.05;
    dust.rotation.y = -t * 0.03;
    tiltWithMouse(root, ctx, dt, { x: 0.05 }, 0.3);
    root.rotation.y = Math.sin(t * 0.25) * 0.55 + root.userData.yOffset;
  };
}

// ── Hybrid: data bars feed particles into a neural network → insight ─────────
export function buildHybridScene(THREE, ctx) {
  const { scene, camera } = ctx;
  const tex = dotTexture(THREE);
  addLights(THREE, scene, 0x06b6d4, 0x8b5cf6);
  camera.position.set(0, 1.6, 12);
  camera.lookAt(0, 0.2, 0);

  const root = new THREE.Group();
  root.position.x = -0.8;
  root.scale.setScalar(0.92);
  scene.add(root);

  const bars = makeBars(THREE, { n: 5, gap: 0.6, low: 0x0e7490, high: 0x22d3ee });
  bars.mesh.position.set(-3.3, -1.3, 0);
  root.add(bars.mesh);

  const net = makeNetwork(THREE, {
    layers: [5, 7, 7, 3],
    spacingX: 1.15,
    spreadY: 3.4,
    spreadZ: 1.4,
    node: 0x8b5cf6,
    edge: 0xa78bfa,
    pulse: 0x22d3ee,
    pulses: 36,
    tex,
  });
  net.group.position.set(2.4, 0.3, 0);
  root.add(net.group);

  // Particles flowing from bar tops into the input layer along arcs
  const F = 70;
  const flowPos = new Float32Array(F * 3);
  const flowGeo = new THREE.BufferGeometry();
  flowGeo.setAttribute('position', new THREE.BufferAttribute(flowPos, 3));
  root.add(new THREE.Points(flowGeo, new THREE.PointsMaterial({ size: 0.2, map: tex, color: 0x67e8f9, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false })));
  const inputs = net.byLayer[0].map((i) => net.nodes[i].clone().add(net.group.position));
  const flows = Array.from({ length: F }, () => ({
    from: new THREE.Vector3(-3.3 + rand(-1.2, 1.2), -1.3 + rand(0.8, 2.4), rand(-1.2, 1.2)),
    to: inputs[Math.floor(Math.random() * inputs.length)],
    p: Math.random(),
    s: rand(0.25, 0.5),
  }));
  const ctrl = new THREE.Vector3();
  const a = new THREE.Vector3();
  const b = new THREE.Vector3();

  // Output "insight" ring
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.03, 12, 60), new THREE.MeshBasicMaterial({ color: 0x22d3ee, transparent: true, opacity: 0.8 }));
  const outX = net.nodes[net.byLayer[net.byLayer.length - 1][0]].x + net.group.position.x + 1.1;
  ring.position.set(outX, 0.3, 0);
  root.add(ring);

  return (t, dt) => {
    bars.update(t);
    net.update(t, dt);
    flows.forEach((f, i) => {
      f.p += dt * f.s;
      if (f.p > 1) {
        f.p = 0;
        f.to = inputs[Math.floor(Math.random() * inputs.length)];
      }
      ctrl.copy(f.from).lerp(f.to, 0.5).add({ x: 0, y: 1.6, z: 0 });
      a.copy(f.from).lerp(ctrl, f.p);
      b.copy(ctrl).lerp(f.to, f.p);
      a.lerp(b, f.p).toArray(flowPos, i * 3);
    });
    flowGeo.attributes.position.needsUpdate = true;
    ring.rotation.y = t * 1.2;
    ring.scale.setScalar(1 + 0.12 * Math.sin(t * 3));
    tiltWithMouse(root, ctx, dt, { x: 0.05 }, 0.22);
    root.rotation.y = Math.sin(t * 0.2) * 0.35 + root.userData.yOffset;
  };
}

// ── Landing: one particle field that morphs to the hovered role ──────────────
const PALETTES = {
  idle: [0x8b5cf6, 0x06b6d4, 0x10b981],
  data: [0x10b981, 0x38bdf8, 0x34d399],
  ai: [0xa855f7, 0xf472b6, 0xc084fc],
  hybrid: [0x8b5cf6, 0x06b6d4, 0x22d3ee],
};

function shapeSphere(n) {
  const out = [];
  const g = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const th = g * i;
    const R = 3.3 + gauss() * 0.06;
    out.push([Math.cos(th) * r * R, y * R, Math.sin(th) * r * R]);
  }
  return out;
}

function shapeBars(n, { cols = 5, gap = 1.15, scale = 1, ox = 0 } = {}) {
  const heights = Array.from({ length: cols * cols }, (_, i) => {
    const x = i % cols, z = Math.floor(i / cols);
    return 0.8 + 3.6 * (0.5 + 0.5 * Math.sin(x * 1.1 + 0.4)) * (0.55 + 0.45 * Math.cos(z * 0.9)) + 0.15 * (x + z);
  });
  const off = ((cols - 1) * gap) / 2;
  const out = [];
  for (let i = 0; i < n; i++) {
    const k = i % heights.length;
    const x = (k % cols) * gap - off;
    const z = Math.floor(k / cols) * gap - off;
    const w = gap * 0.2;
    out.push([
      (x + rand(-w, w)) * scale + ox,
      (rand(0, heights[k]) - 2.2) * scale,
      (z + rand(-w, w)) * scale,
    ]);
  }
  return out;
}

function shapeNetwork(n, { layers = [4, 7, 7, 4], sx = 1.9, sy = 4.6, scale = 1, ox = 0 } = {}) {
  const nodes = [];
  const byLayer = [];
  layers.forEach((c, li) => {
    const ids = [];
    for (let j = 0; j < c; j++) {
      ids.push(nodes.length);
      nodes.push([li * sx - ((layers.length - 1) * sx) / 2, (c === 1 ? 0 : j / (c - 1) - 0.5) * sy * Math.min(1, c / 6 + 0.3), Math.sin(j * 1.7 + li) * 0.6]);
    }
    byLayer.push(ids);
  });
  const edges = [];
  for (let li = 0; li < byLayer.length - 1; li++) byLayer[li].forEach((a) => byLayer[li + 1].forEach((b) => edges.push([a, b])));
  const out = [];
  for (let i = 0; i < n; i++) {
    let p;
    if (i % 5 < 2) {
      const c = nodes[i % nodes.length];
      p = [c[0] + gauss() * 0.09, c[1] + gauss() * 0.09, c[2] + gauss() * 0.09];
    } else {
      const [a, b] = edges[i % edges.length].map((k) => nodes[k]);
      const u = Math.random();
      p = [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u];
    }
    out.push([p[0] * scale + ox, p[1] * scale, p[2] * scale]);
  }
  return out;
}

function shapeHybrid(n) {
  const half = Math.floor(n / 2);
  return [
    ...shapeBars(half, { cols: 4, gap: 0.85, scale: 0.85, ox: -2.4 }),
    ...shapeNetwork(n - half, { layers: [4, 6, 6, 3], sx: 1.3, sy: 4, scale: 0.9, ox: 2.6 }),
  ];
}

export function buildLandingScene(THREE, ctx, shapeRef) {
  const { scene, camera } = ctx;
  const tex = dotTexture(THREE);
  camera.position.set(0, 0, 13);

  const N = 2400;
  const shapes = {
    idle: shapeSphere(N),
    data: shapeBars(N),
    ai: shapeNetwork(N),
    hybrid: shapeHybrid(N),
  };
  // Shuffle per-shape assignment so particles travel interesting paths.
  Object.values(shapes).forEach((arr) => arr.sort(() => Math.random() - 0.5));

  const pos = new Float32Array(N * 3);
  const col = new Float32Array(N * 3);
  shapes.idle.forEach((p, i) => pos.set(p, i * 3));
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  const mat = new THREE.PointsMaterial({ size: 0.11, map: tex, vertexColors: true, transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending, depthWrite: false });
  const points = new THREE.Points(geo, mat);
  const root = new THREE.Group();
  root.add(points);
  scene.add(root);

  const speed = Float32Array.from({ length: N }, () => rand(1.6, 3.4));
  const pick = Uint8Array.from({ length: N }, () => Math.floor(Math.random() * 3));
  const cols = {};
  Object.entries(PALETTES).forEach(([k, arr]) => { cols[k] = arr.map((c) => new THREE.Color(c)); });
  const c = new THREE.Color();
  let current = 'idle';
  for (let i = 0; i < N; i++) cols.idle[pick[i]].toArray(col, i * 3);

  return (t, dt) => {
    const target = shapeRef?.current || 'idle';
    if (target !== current) current = target;
    const tgt = shapes[current];
    const pal = cols[current];
    for (let i = 0; i < N; i++) {
      const k = Math.min(1, dt * speed[i]);
      const j = i * 3;
      const w = 0.04 * Math.sin(t * 1.5 + i);
      pos[j] += (tgt[i][0] - pos[j]) * k;
      pos[j + 1] += (tgt[i][1] + w - pos[j + 1]) * k;
      pos[j + 2] += (tgt[i][2] - pos[j + 2]) * k;
      c.fromArray(col, j).lerp(pal[pick[i]], Math.min(1, dt * 3));
      c.toArray(col, j);
    }
    geo.attributes.position.needsUpdate = true;
    geo.attributes.color.needsUpdate = true;
    if (current === 'idle') {
      root.rotation.y += dt * 0.15;
    } else {
      // Unwind any accumulated spin, then sway gently so the shape stays readable.
      root.rotation.y = Math.atan2(Math.sin(root.rotation.y), Math.cos(root.rotation.y));
      const yaw = Math.sin(t * 0.3) * 0.35 + ctx.mouse.x * 0.3 + (current === 'data' ? 0.6 : 0);
      root.rotation.y += (yaw - root.rotation.y) * Math.min(1, dt * 1.5);
    }
    // Desktop: sit in the right half beside the copy. Mobile: float above it.
    const halfH = Math.tan((camera.fov * Math.PI) / 360) * camera.position.z;
    const halfW = halfH * (ctx.aspect || 1);
    const wide = (ctx.aspect || 1) > 1.1;
    const tx = wide ? halfW * 0.38 : 0;
    const ty = wide ? 0 : halfH * 0.5;
    const ts = wide ? Math.min(1.15, halfW / 7.5) : Math.min(0.85, halfW / 3.9);
    const e = Math.min(1, dt * 4) || 1;
    root.position.x += (tx - root.position.x) * e;
    root.position.y += (ty - root.position.y) * e;
    root.scale.setScalar(root.scale.x + (ts - root.scale.x) * e);
    root.rotation.x += ((current === 'data' ? 0.22 : 0.1) - ctx.mouse.y * 0.2 - root.rotation.x) * Math.min(1, dt * 2);
  };
}
