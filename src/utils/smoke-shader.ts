import { shaderMaterial } from '@react-three/drei';
import { extend, type ThreeElement } from '@react-three/fiber';
import fragmentShader from '../shaders/smoke/fragment.glsl';
import vertextShader from '../shaders/smoke/vertex.glsl';
import * as THREE from 'three';

const textureLoader = new THREE.TextureLoader();
const smokeTexture = textureLoader.load('/textures/smoke_03.png');

const SmokeShaderMaterial = shaderMaterial(
  {
    uSize: 3,
    uTexture: smokeTexture,
    uTime: 0,
    uTimeCoEfficent: 0,
    uResolution: new THREE.Vector2(),
    uLife: 1.0,
  },
  vertextShader,
  fragmentShader
);

extend({ SmokeShaderMaterial });

declare module '@react-three/fiber' {
  interface ThreeElements {
    smokeShaderMaterial: ThreeElement<typeof SmokeShaderMaterial>;
  }
}

export { SmokeShaderMaterial };
