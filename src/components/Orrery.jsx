import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Suspense, useState, useEffect, useRef } from 'react';
import MultipleOrbits from './MultipleOrbits'; // Archivo de los objetos y órbitas
import * as THREE from 'three';



function Orrery() {
  const apiKey = 'jgopeEILN3fZOUs8IyYCsCjhp6JCQ2qjXdPvihE2';
  const [targetPosition, setTargetPosition] = useState(new THREE.Vector3(15, 20, 15));
  const [showInfo, setShowInfo] = useState(false);
  const [objectData, setObjectData] = useState(null);
  const [showModel, setShowModel] = useState(false); 
  const [selectedObject, setSelectedObject] = useState(null);  // Almacena el ID del objeto seleccionado
  const [autoMove, setAutoMove] = useState(false);  // Controla si la cámara se mueve automáticamente
  const [key, setKey] = useState(0); 
  const orbitControlsRef = useRef();  // Referencia a los controles de la cámara

  // Función para manejar el clic en un objeto
 
const handleObjectClick = async (id, cameraPosition) => {
  try {
    // URL de la NASA con el ID del asteroide y la clave API
    const url = `https://api.nasa.gov/neo/rest/v1/neo/${id}?api_key=${apiKey}`;
    
    // Realiza la solicitud a la API de la NASA
    const response = await fetch(url);
    
     
    if (!response.ok) {
      throw new Error('Error fetching asteroid data');
    }

    // Convert the response to JSON
    const asteroidData = await response.json();

    // Extract the relevant data from the asteroid
    const objectData = {
      name: asteroidData.name,
      discovery: asteroidData.discovery_date || 'Unknown discovery date',
      description: `Absolute Magnitude: ${asteroidData.absolute_magnitude_h}. Estimated Diameter: ${asteroidData.estimated_diameter.kilometers.estimated_diameter_max} km.`,
    };
    // Establece los datos en el estado
    setObjectData(objectData);
    setShowInfo(true);
    setTargetPosition(cameraPosition);  // Usará la posición calculada en MultipleOrbits
    setShowModel(true);
    setSelectedObject(id);  // Establece el objeto seleccionado
    setAutoMove(true);  // Activa el movimiento automático

  } catch (error) {
    console.error('Error al obtener los datos del asteroide:', error);
  }
};

  // Función para volver a la vista inicial
  const handleResetView = () => {
    const initialTarget = new THREE.Vector3(0, 0, 0); // El objetivo es el centro de la escena
    const initialPosition = new THREE.Vector3(15, 20, 15); // Posición inicial de la cámara
  
    // Actualiza la posición objetivo y el estado del componente
    setTargetPosition(initialTarget);
    setShowInfo(false); // Ocultar el panel flotante
    setShowModel(false);
    setSelectedObject(null);  // Deseleccionar el objeto
    setAutoMove(true);  // Activa el movimiento automático para volver a la posición inicial
  
    // Restablece la posición de la cámara y el objetivo de OrbitControls
    if (orbitControlsRef.current) {
      // Restablece el objetivo de OrbitControls
      orbitControlsRef.current.target.set(initialTarget.x, initialTarget.y, initialTarget.z); 
      orbitControlsRef.current.update(); // Actualiza los controles
    }
  
    // Actualiza la posición de la cámara
    const { camera } = useThree(); // Obtén la cámara desde Three.js
    camera.position.set(initialPosition.x, initialPosition.y, initialPosition.z); // Establece la posición de la cámara
    camera.zoom = 10; // Restablece el zoom de la cámara
    camera.updateProjectionMatrix(); // Asegura que la matriz de proyección esté actualizada
  
    // Reactivar los controles después de mover la cámara
    if (orbitControlsRef.current) {
      orbitControlsRef.current.enabled = true; // Vuelve a habilitar los controles si fueron deshabilitados
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
      <Canvas key={key} camera={{ zoom: 10, position: [15, 20, 15] }} className="w-full h-full">
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
              <i className="fas fa-arrow-left"></i> See all
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
          </div>
      
          {/* Contenido principal del panel */}
          <div className="mt-8">
            <h3 className="text-xl font-bold">Discovery: {objectData.discovery}</h3>
            <p className="mt-4 text-lg">{objectData.description}</p>
          </div>
      
          
        </div>
      )}
    </div>
  );
}

export default Orrery;
