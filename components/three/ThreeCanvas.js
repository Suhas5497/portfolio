import { useEffect, useRef } from 'react';

// Mounts a Three.js scene client-side only. `build(THREE, ctx)` sets up objects on
// ctx.scene / ctx.camera and returns `update(t, dt, ctx)` called every frame.
// Pauses when off-screen or the tab is hidden; renders one static frame under
// prefers-reduced-motion.
export default function ThreeCanvas({ build, className = '', cameraZ = 12, fov = 45, deps = [] }) {
  const mountRef = useRef(null);
  const ctxRef = useRef(null);

  useEffect(() => {
    let disposed = false;
    let frame = 0;
    let cleanup = () => {};

    import('three').then((THREE) => {
      const mount = mountRef.current;
      if (disposed || !mount) return;

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);
      mount.appendChild(renderer.domElement);
      renderer.domElement.style.display = 'block';

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(fov, 1, 0.1, 200);
      camera.position.set(0, 0, cameraZ);

      const ctx = { THREE, scene, camera, renderer, mouse: { x: 0, y: 0 }, state: {} };
      ctxRef.current = ctx;
      const update = build(THREE, ctx) || (() => {});

      const resize = () => {
        const w = mount.clientWidth || 1;
        const h = mount.clientHeight || 1;
        renderer.setSize(w, h, false);
        renderer.domElement.style.width = '100%';
        renderer.domElement.style.height = '100%';
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        ctx.aspect = w / h;
      };
      resize();
      const ro = new ResizeObserver(resize);
      ro.observe(mount);

      const onMove = (e) => {
        ctx.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        ctx.mouse.y = -((e.clientY / window.innerHeight) * 2 - 1);
      };
      window.addEventListener('pointermove', onMove, { passive: true });

      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      let visible = true;
      const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
      io.observe(mount);

      const clock = new THREE.Clock();
      let last = 0;
      const loop = () => {
        frame = requestAnimationFrame(loop);
        if (!visible || document.hidden) { clock.getDelta(); return; }
        const t = clock.getElapsedTime();
        const dt = Math.min(t - last, 0.05);
        last = t;
        update(t, dt, ctx);
        renderer.render(scene, camera);
      };

      if (reduced) {
        update(2, 0, ctx);
        renderer.render(scene, camera);
      } else {
        loop();
      }

      cleanup = () => {
        cancelAnimationFrame(frame);
        ro.disconnect();
        io.disconnect();
        window.removeEventListener('pointermove', onMove);
        scene.traverse((obj) => {
          obj.geometry?.dispose();
          const mats = Array.isArray(obj.material) ? obj.material : obj.material ? [obj.material] : [];
          mats.forEach((m) => { m.map?.dispose(); m.dispose(); });
        });
        renderer.dispose();
        renderer.domElement.remove();
      };
    });

    return () => {
      disposed = true;
      cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return <div ref={mountRef} className={className} aria-hidden="true" />;
}

// Soft round sprite for point clouds.
export function dotTexture(THREE) {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d');
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, 'rgba(255,255,255,1)');
  grad.addColorStop(0.35, 'rgba(255,255,255,0.8)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
