import { useLoader } from '@react-three/fiber';
import { TextureLoader, RepeatWrapping } from 'three';
import { GROUND_LEVEL } from '../Experience';

export default function Ground({
  size = 100,
  textureUrl = '/grass.jpg',
  repeat = 20,
}) {
  const texture = useLoader(TextureLoader, textureUrl);

  texture.wrapS = texture.wrapT = RepeatWrapping;
  texture.repeat.set(repeat, repeat);

  return (
    <mesh position={[0, GROUND_LEVEL, 0]} receiveShadow>
      <boxGeometry args={[size, 0.1, size]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
}
