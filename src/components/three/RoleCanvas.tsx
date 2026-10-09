import type { RoleKey } from '@/data/projects';
import SceneCanvas from './SceneCanvas';
import { RoleScene } from './Scenes';

export default function RoleCanvas({ role, className = '' }: { role: RoleKey; className?: string }) {
  return (
    <SceneCanvas className={className} camera={{ position: [0, 0.4, 9.5], fov: 45 }}>
      <RoleScene role={role} />
    </SceneCanvas>
  );
}
