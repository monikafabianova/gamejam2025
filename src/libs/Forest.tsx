import { GROUND_LEVEL } from '../Experience';
import Tree from './Tree';

type ForestProps = {
  count?: number;
  radius?: number;
  innerRadius?: number;
  minDistance?: number;
};

export default function Forest({
  count = 50,
  radius = 50,
  innerRadius = 5,
  minDistance = 2,
}: ForestProps) {
  const positions: [number, number, number][] = [];

  let attempts = 0;
  const maxAttempts = count * 10; // prevent infinite loops

  while (positions.length < count && attempts < maxAttempts) {
    const x = (Math.random() - 0.5) * 2 * radius;
    const z = (Math.random() - 0.5) * 2 * radius;
    const distanceFromCenter = Math.hypot(x, z);

    if (distanceFromCenter < innerRadius || distanceFromCenter > radius) {
      attempts++;
      continue;
    }

    const pos: [number, number, number] = [x, GROUND_LEVEL, z];

    const tooClose = positions.some(
      (p) => Math.hypot(p[0] - x, p[2] - z) < minDistance
    );

    if (!tooClose) {
      positions.push(pos);
    }

    attempts++;
  }

  return (
    <>
      {positions.map((pos, i) => (
        <Tree
          key={i}
          position={pos}
          rotation={[0, Math.random() * Math.PI * 2, 0]}
          scale={0.01 + Math.random() * 0.01}
        />
      ))}
    </>
  );
}
