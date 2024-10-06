import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Suspense } from 'react';
import MultipleOrbits from './MultipleOrbits'; // Asegúrate de que esta ruta sea correcta

function Orrery() {
  return (
    <Canvas camera={{ zoom: 10, position: [15, 20, 15] }}>
      <ambientLight intensity={1} />
      <pointLight position={[35, 35, 0]} intensity={1} />
      <Suspense>
        <MultipleOrbits />
      </Suspense>

      {/* OrbitControls con restricciones */}
      <OrbitControls
        enablePan={false} // Permitir desplazamiento
        enableZoom={true} // Permitir zoom
        minDistance={1} // Distancia mínima de zoom (más cerca)
        maxDistance={60} // Distancia máxima de zoom (evita alejarse demasiado)
        
      />
    </Canvas>
  );
}

export default Orrery;
