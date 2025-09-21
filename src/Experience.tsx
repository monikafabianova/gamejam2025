import {
  GizmoHelper,
  GizmoViewport,
  OrbitControls,
  Environment,
  MeshReflectorMaterial,
  TransformControls,
} from '@react-three/drei';
import { useControls } from 'leva';
import { useFrame, useLoader } from '@react-three/fiber';
import { useRef } from 'react';
import { Perf } from 'r3f-perf';
import useGame from './store/useGame.ts';
import * as THREE from 'three';
import GroundCells from './libs/GroundCells.tsx';
import Tree from './libs/Tree.tsx';
import TexturedFBX from './libs/TexturedFBX.tsx';
import Forest from './libs/Forest.tsx';
import Ground from './libs/Ground.tsx';

export const GROUND_LEVEL = 0;

const Experience = () => {
  const cubeRef = useRef<THREE.Object3D>(null!);

  const { perfVisible } = useControls({
    perfVisible: true,
  });

  useFrame((_state, delta) => {
    if (cubeRef.current) {
      cubeRef.current.rotation.y += delta;
    }
  });

  const { envMapIntensity } = useControls('environment map', {
    envMapIntensity: { value: 3.5, min: 0, max: 12 },
  });
  const envGround = useControls('environment ground', {
    height: { value: 15, min: 0, max: 50 },
    radius: { value: 60, min: 10, max: 200 },
    scale: { value: 1000, min: 100, max: 5000 },
  });
  const treeNumber = useControls('trees', {
    treeNumber: { value: 1, min: 1, max: 6, step: 1 },
  }).treeNumber;
  const forest = useControls('forest', {
    count: { value: 250, min: 0, max: 500, step: 1 },
    radius: { value: 30, min: 1, max: 250, step: 1 },
    innerRadius: { value: 15, min: 0, max: 50, step: 1 },
    minDistance: { value: 0, min: 0, max: 10, step: 0.1 },
  });
  const ground = useControls('ground', {
    size: { value: 100, min: 10, max: 500, step: 10 },
    repeat: { value: 20, min: 1, max: 100, step: 1 },
  });

  const grassTexture = useLoader(
    THREE.TextureLoader,
    '/cooking_fire_ground_colour.png'
  );
  grassTexture.colorSpace = THREE.SRGBColorSpace;

  return (
    <>
      <Environment
        files={'kloofendal_48d_partly_cloudy_puresky_1k.hdr'}
        background
        ground={{
          height: envGround.height,
          radius: envGround.radius,
          scale: envGround.scale,
        }}
      />

      {perfVisible && <Perf position='top-left' />}
      <GroundCells />

      <Ground size={ground.size} repeat={ground.repeat} />

      {/* controls */}
      <OrbitControls makeDefault />

      {/* floor */}
      <mesh position-y={-1} rotation-x={-Math.PI * 0.5} scale={10}>
        <planeGeometry args={[1, 1]} />
        <MeshReflectorMaterial
          resolution={512}
          blur={[1000, 1000]}
          mixBlur={0.9}
          color='grey'
          mirror={0.5}
          envMapIntensity={envMapIntensity}
        />
      </mesh>

      <Tree treeNumber={treeNumber} position={[1, GROUND_LEVEL, 1]} />
      <TexturedFBX url='/morgan_idle.fbx' texture='morgan_colour.png' />
      <TexturedFBX
        url='/cooking_fire_mesh.fbx'
        texture='cooking_fire_colour.png'
        position={[-1, GROUND_LEVEL, -1]}
      />
      <Forest
        count={forest.count}
        radius={forest.radius}
        innerRadius={forest.innerRadius}
        minDistance={forest.minDistance}
      />

      {/* GizmoHelper */}
      <GizmoHelper alignment='bottom-right' margin={[100, 100]}>
        <GizmoViewport labelColor='white' axisHeadScale={1} />
      </GizmoHelper>
    </>
  );
};

export default Experience;
