import './App.css'
import { Canvas } from '@react-three/fiber'

function App() {
  return (
    <>
      <Canvas>
        <mesh>
          <torusKnotGeometry />
          <meshNormalMaterial />
        </mesh>
      </Canvas>
    </>
  )
}

export default App
