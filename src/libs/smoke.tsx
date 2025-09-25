import * as THREE from 'three';
import { useLayoutEffect, useRef } from 'react';
import { useFrame, useThree, type ThreeElements } from '@react-three/fiber';
import { useControls } from 'leva';
import { SmokeShaderMaterial } from '../utils/smoke-shader.ts';

export const Smoke = (props: ThreeElements['points']) => {
  const bufferGeometryRef = useRef<THREE.BufferGeometry>(null!);

  const { size, viewport } = useThree();

  const smokeShaderRef = useRef<ThreeElements['smokeShaderMaterial']>(null!);

  const { uLife, uSize, uTimeCoEfficent, particlesCount, radius } = useControls(
    'smoke',
    {
      uLife: {
        value: 0.25,
        min: 0.1,
        max: 1.0,
        step: 0.01,
      },
      uSize: {
        value: 0.9,
        min: 0.1,
        max: 10,
        step: 0.1,
      },
      uTimeCoEfficent: {
        value: 0.05,
        min: 0.01,
        max: 2,
        step: 0.001,
      },
      particlesCount: {
        value: 50,
        min: 10,
        max: 100,
        step: 1,
      },
      radius: {
        value: 0.03,
        min: 0.005,
        max: 1,
        step: 0.01,
      },
    }
  );

  useLayoutEffect(() => {
    const count = particlesCount;

    const positionArray = new Float32Array(count * 3);
    const sizeArray = new Float32Array(count);
    const timeMultiplier = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      sizeArray[i] = Math.random() * 0.5;
      timeMultiplier[i] = Math.random();

      const shape = new THREE.Cylindrical(
        radius,
        Math.random() * Math.PI * 2,
        0.01
      );

      const position = new THREE.Vector3();
      position.setFromCylindrical(shape);

      const i3 = i * 3;
      positionArray[i3] = position.x;
      positionArray[i3 + 1] = position.y;
      positionArray[i3 + 2] = position.z;
    }

    const bufferAttribute = new THREE.Float32BufferAttribute(positionArray, 3);
    const sizeAttribute = new THREE.Float32BufferAttribute(sizeArray, 1);
    const timeMultiplierAttribute = new THREE.Float32BufferAttribute(
      timeMultiplier,
      1
    );

    if (bufferGeometryRef.current) {
      bufferGeometryRef.current.setAttribute('position', bufferAttribute);
      bufferGeometryRef.current.setAttribute('aSize', sizeAttribute);
      bufferGeometryRef.current.setAttribute(
        'aTimeMultiplier',
        timeMultiplierAttribute
      );
    }
  }, [particlesCount, radius]);

  useFrame((state) => {
    smokeShaderRef.current.uTime = state.clock.getElapsedTime();
  });

  return (
    // set render order to 1 so the smoke renders 1 milsec after
    <points {...props} renderOrder={1}>
      <bufferGeometry ref={bufferGeometryRef} />
      <smokeShaderMaterial
        key={SmokeShaderMaterial.key}
        ref={smokeShaderRef}
        uSize={uSize}
        uLife={uLife}
        uTimeCoEfficent={uTimeCoEfficent}
        uResolution={[size.width * viewport.dpr, size.height * viewport.dpr]}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        transparent={false}
      />
    </points>
  );
};
