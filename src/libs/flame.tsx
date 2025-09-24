import * as THREE from 'three';
import { FireShaderMaterial } from '../utils/fire-shader.ts';
import { useLayoutEffect, useRef } from 'react';
import { useFrame, useThree, type ThreeElements } from '@react-three/fiber';
import { useControls } from 'leva';

export const Flame = (props: ThreeElements['points']) => {
  const bufferGeometryRef = useRef<THREE.BufferGeometry>(null!);

  const { size, viewport } = useThree();

  const fireShaderRef = useRef<ThreeElements['fireShaderMaterial']>(null!);

  const {
    uColorA,
    uColorB,
    uLife,
    uSize,
    timeMuliplierValue,
    particlesCount,
    radius,
  } = useControls('flame', {
    uColorA: '#ffbf00',
    uColorB: '#ff1108',
    uLife: {
      value: 0.37,
      min: 0.1,
      max: 1.0,
      step: 0.01,
    },
    uSize: {
      value: 1.6,
      min: 0.1,
      max: 10,
      step: 0.1,
    },
    timeMuliplierValue: {
      value: 1.05,
      min: 0.01,
      max: 2,
      step: 0.001,
    },
    particlesCount: {
      value: 150,
      min: 50,
      max: 1000,
      step: 1,
    },
    radius: {
      value: 0.15,
      min: 0.01,
      max: 1,
      step: 0.01,
    },
  });

  useLayoutEffect(() => {
    const count = particlesCount;

    const positionArray = new Float32Array(count * 3);
    const sizeArray = new Float32Array(count);
    const timeMultiplier = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      sizeArray[i] = Math.random() * 0.5;
      timeMultiplier[i] = Math.random() + timeMuliplierValue;

      const shape = new THREE.Cylindrical(
        radius,
        Math.random() * Math.PI * 2,
        0.01
      );

      new THREE.CircleGeometry();

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
        'timeMultiplier',
        timeMultiplierAttribute
      );
    }
  }, [timeMuliplierValue, particlesCount, radius]);

  useFrame((state) => {
    fireShaderRef.current.uTime = state.clock.getElapsedTime();
  });

  return (
    // set render order to 1 so the flame renders last
    <points {...props} renderOrder={1}>
      <bufferGeometry ref={bufferGeometryRef} />
      <fireShaderMaterial
        key={FireShaderMaterial.key}
        ref={fireShaderRef}
        uSize={uSize}
        uColorA={new THREE.Color(uColorA)}
        uColorB={new THREE.Color(uColorB)}
        uLife={uLife}
        uResolution={[size.width * viewport.dpr, size.height * viewport.dpr]}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        transparent={false}
      />
    </points>
  );
};
