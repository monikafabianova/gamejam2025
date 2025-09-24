import {
  GizmoHelper,
  GizmoViewport,
  OrbitControls,
  Environment,
  KeyboardControls,
} from '@react-three/drei';
import { useControls } from 'leva';
import { useFrame, useLoader } from '@react-three/fiber';
import { useRef } from 'react';
import { Perf } from 'r3f-perf';
import * as THREE from 'three';
import GroundCells from './libs/GroundCells.tsx';
import Tree from './libs/Tree.tsx';
import TexturedFBX from './libs/TexturedFBX.tsx';
import Forest from './libs/Forest.tsx';
import Ground from './libs/Ground.tsx';
import { Character } from './components/character.tsx';
import { CuboidCollider, Physics, RigidBody } from '@react-three/rapier';
import Ecctrl from 'ecctrl';
import { keyboardMap } from './utils/keyboard-map.ts';
import { Flame } from './libs/flame.tsx';

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

  const { flamePositon } = useControls('flame', {
    flamePositon: [-1, 0.15, -1],
  });

  /** this isnt reactive for some reason so values are being set manually in @disableFollowCamPos and @disableFollowCamPos */
  const {
    cameraPositionX,
    cameraPositionY,
    cameraPositionZ,
    cameraTargetX,
    cameraTargetY,
    cameraTargetZ,
  } = useControls('camera', {
    cameraPositionX: {
      value: 0,
      min: -100,
      max: 100,
      step: 0.1,
    },
    cameraPositionY: {
      value: 0,
      min: -100,
      max: 100,
      step: 0.1,
    },
    cameraPositionZ: {
      value: 0,
      min: -100,
      max: 100,
      step: 0.1,
    },

    cameraTargetX: {
      value: 0,
      min: -100,
      max: 100,
      step: 0.1,
    },
    cameraTargetY: {
      value: 0,
      min: -100,
      max: 100,
      step: 0.1,
    },
    cameraTargetZ: {
      value: 0,
      min: -100,
      max: 100,
      step: 0.1,
    },
  });

  const { physcisDebug } = useControls('physcis', {
    physcisDebug: false,
  });

  const grassTexture = useLoader(
    THREE.TextureLoader,
    '/cooking_fire_ground_colour.png'
  );
  grassTexture.colorSpace = THREE.SRGBColorSpace;

  const fireplacePosition = new THREE.Vector3(-1, GROUND_LEVEL + 0.08, -1);

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
      {/* controls */}
      <OrbitControls makeDefault />

      <Physics debug={physcisDebug} timeStep={'vary'}>
        <KeyboardControls map={keyboardMap}>
          <Ecctrl
            animated
            disableFollowCam={true}
            disableFollowCamPos={{
              x: -5,
              y: 5,
              z: -5,
            }}
            disableFollowCamTarget={{
              x: 0,
              y: 0,
              z: 0,
            }}
            characterInitDir={Math.PI}
          >
            <Character />
          </Ecctrl>
        </KeyboardControls>

        <RigidBody type='fixed' colliders='cuboid'>
          <Ground size={ground.size} repeat={ground.repeat} />
        </RigidBody>

        {/* fire place physcis collider */}
        <CuboidCollider
          onCollisionEnter={() => console.log('enter fireplace')}
          onCollisionExit={() => console.log('left fireplace')}
          args={[0.8, 1, 0.8]}
          position={fireplacePosition}
        />
      </Physics>

      <Tree treeNumber={treeNumber} position={[1, GROUND_LEVEL, 1]} />
      {/* fireplace */}
      <group>
        {/* flame-shader */}
        <Flame position={flamePositon} />
        <TexturedFBX
          scale={0.015}
          url='/cooking_fire_mesh.fbx'
          texture='cooking_fire_colour.png'
          position={fireplacePosition}
        />
      </group>

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
