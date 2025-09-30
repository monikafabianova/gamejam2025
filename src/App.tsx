import './index.css';
import { Canvas } from '@react-three/fiber';
import Experience from './Experience';
import * as THREE from 'three';
import { Leva } from 'leva';

function App() {
  return (
    <>
      <Leva collapsed hidden />
      <Canvas
        shadows='soft'
        gl={{ antialias: true }}
        onCreated={({ gl }) => {
          gl.outputColorSpace = THREE.SRGBColorSpace;
        }}
        camera={{
          fov: 45,
          near: 0.1,
          far: 200,
          position: [-5, 5, -5],
        }}
      >
        <Experience />
      </Canvas>
    </>
  );
}

export default App;
