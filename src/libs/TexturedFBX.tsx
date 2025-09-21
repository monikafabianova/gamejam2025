import { useEffect, type JSX } from 'react';
import { useLoader } from '@react-three/fiber';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import * as THREE from 'three';
import { GROUND_LEVEL } from '../Experience';

type TexturedFBXProps = {
  url: string;
  texture: string;
} & JSX.IntrinsicElements['group'];

export default function TexturedFBX({
  url,
  texture,
  ...props
}: TexturedFBXProps) {
  const baseFbx = useLoader(FBXLoader, url);
  const baseTexture = useLoader(THREE.TextureLoader, texture);

  const fbx = baseFbx.clone(true);
  if (props.scale === undefined) {
    props.scale = [0.01, 0.01, 0.01];
  }
  if (props.position === undefined) {
    props.position = [0, GROUND_LEVEL, 0];
  }

  useEffect(() => {
    const colorMap = baseTexture.clone();
    colorMap.colorSpace = THREE.SRGBColorSpace;
    fbx.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (mesh.isMesh) {
        mesh.material = new THREE.MeshStandardMaterial({
          map: colorMap,
        });
      }
    });
  }, [fbx, baseTexture]);

  return (
    <group {...props}>
      <primitive object={fbx} />
    </group>
  );
}
