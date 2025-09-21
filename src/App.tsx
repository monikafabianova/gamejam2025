import './index.css';
import { Canvas } from '@react-three/fiber';
import Experience from './Experience';
import * as THREE from 'three';

function App() {
  return (
    <>
      <Canvas
        gl={{ antialias: true }}
        onCreated={({ gl }) => {
          gl.outputColorSpace = THREE.SRGBColorSpace;
        }}
        camera={{
          fov: 45,
          near: 0.1,
          far: 200,
          position: [-4, 3, 6],
        }}
      >
        <Experience />
      </Canvas>
    </>
  );
}

export default App;
