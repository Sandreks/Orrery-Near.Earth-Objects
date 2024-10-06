import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Suspense, useState, useEffect, useRef } from 'react';
import MultipleOrbits from './MultipleOrbits'; // Archivo de los objetos y órbitas
import * as THREE from 'three';

function Orrery() {
  const [targetPosition, setTargetPosition] = useState(new THREE.Vector3(15, 20, 15));
  const [showInfo, setShowInfo] = useState(false);
  const [objectData, setObjectData] = useState(null);
  const [showModel, setShowModel] = useState(false); 
  const [selectedObject, setSelectedObject] = useState(null);  // Almacena el ID del objeto seleccionado
  const [autoMove, setAutoMove] = useState(false);  // Controla si la cámara se mueve automáticamente
  const orbitControlsRef = useRef();  // Referencia a los controles de la cámara

  // Función para manejar el clic en un objeto
  const handleObjectClick = (id, cameraPosition) => {
    const mockData = {
      1: { name: '21 Lutetia', discovery: 'Discovered in 1852', description: 'Visited by Rosetta in 2010.' },
      2: { name: 'Comet', discovery: 'First seen in 1996', description: 'A comet that revisits every 75 years.' },
      3: { name: 'Asteroid', discovery: 'Discovered in 1902', description: 'Orbits between Mars and Jupiter.' },
    };
  
    setObjectData(mockData[id]);
    setShowInfo(true);
    setTargetPosition(cameraPosition);  // Usará la posición calculada en MultipleOrbits
    setShowModel(true);   
    setSelectedObject(id);  // Establece el objeto seleccionado
    setAutoMove(true);  // Activa el movimiento automático
  };

  // Función para volver a la vista inicial
  const handleResetView = () => {
    const initialPosition = new THREE.Vector3(0, 0, 0); // Posición inicial de la cámara
    setTargetPosition(initialPosition); // Actualiza la posición objetivo
    setShowInfo(false); // Ocultar el panel flotante
    setShowModel(false);
    setSelectedObject(null);  // Deseleccionar el objeto
    setAutoMove(true);  // Activa el movimiento automático para volver a la posición inicial

    // Restablece el objetivo de OrbitControls
    if (orbitControlsRef.current) {
      orbitControlsRef.current.target.set(initialPosition.x, initialPosition.y, initialPosition.z);
      orbitControlsRef.current.update(); // Actualiza los controles
    }
  };

  useEffect(() => {
    // Desactiva el movimiento automático después de 2 segundos para permitir la manipulación manual de la cámara
    if (autoMove) {
      const timeout = setTimeout(() => {
        setAutoMove(false);  // Permite que los OrbitControls vuelvan a tomar control
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [autoMove]);

  return (
    <div className="relative w-full h-full">
      <Canvas camera={{ zoom: 10, position: [15, 20, 15] }} className="w-full h-full">
        <ambientLight intensity={1} />
        <pointLight position={[35, 35, 0]} intensity={1} />
        <Suspense>
          <MultipleOrbits 
            onClick={handleObjectClick} 
            showModel={showModel}  // Pasamos el estado a MultipleOrbits
            selectedObject={selectedObject}  // Pasamos el objeto seleccionado
            targetPosition={targetPosition} // Pasamos la posición de la cámara calculada
            orbitControls={orbitControlsRef.current}  // Pasamos los controles de órbita
          />
        </Suspense>

        {/* OrbitControls con restricciones */}
        <OrbitControls 
          ref={orbitControlsRef}
          enablePan={false} 
          enableZoom={true} 
          minDistance={1} 
          maxDistance={90}
          enableRotate={!autoMove}  // Desactiva rotación cuando la cámara se mueve automáticamente
        />
      </Canvas>

      {/* Panel flotante para mostrar la información */}
      {showInfo && (
        <div className="absolute top-1/2 transform -translate-y-1/2 left-10 bg-gray-900 bg-opacity-90 text-white p-8 rounded-lg shadow-2xl w-96 z-10">
          <div className="flex justify-between items-center">
            {/* Botón de retroceso */}
            <button onClick={handleResetView} className="text-gray-400 hover:text-gray-200">
              <i className="fas fa-arrow-left"></i> See all asteroids
            </button>
            {/* Botón de cierre */}
            <button className="text-gray-400 hover:text-gray-200">
              <i className="fas fa-times"></i>
            </button>
          </div>
      
          {/* Título del objeto */}
          <h2 className="text-3xl font-bold mt-6 mb-4">{objectData.name}</h2>
      
          {/* Pestañas para cambiar entre Essential stats y Orbital path */}
          <div className="flex justify-between mt-4">
            <button className="text-white font-semibold border-b-4 border-white pb-1">Essential stats</button>
            <button className="text-gray-400 hover:text-white">Orbital path</button>
          </div>
      
          {/* Contenido principal del panel */}
          <div className="mt-8">
            <h3 className="text-xl font-bold">Discovery</h3>
            <p className="mt-4 text-lg">{objectData.description}</p>
          </div>
      
          {/* Paginación y flecha para navegar */}
          <div className="flex justify-between mt-10">
            <div className="flex space-x-3">
              {/* Puntos de paginación */}
              <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
              <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
              <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
              <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
              <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
            </div>
            {/* Botón de flecha derecha */}
            <button className="text-gray-400 hover:text-white">
              <i className="fas fa-arrow-right"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Orrery;
