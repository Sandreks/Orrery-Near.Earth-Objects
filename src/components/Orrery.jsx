import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import axios from 'axios';

// Simulación de objetos celestes
const celestialBodies = [
  { name: 'Earth', position: [5, 0, 0], info: 'earth', model: '/path/to/earth-model.gltf' },
  { name: 'Mars', position: [8, 0, 0], info: 'mars', model: '/path/to/mars-model.gltf' },
  // Añade más cuerpos celestes
];

// Componente que representa un icono de objeto en la órbita
function CelestialIcon({ position, name, onClick }) {
  return (
    <mesh position={position} onClick={onClick}>
      <sphereGeometry args={[0.2, 32, 32]} />
      <meshStandardMaterial color="yellow" />
      <Html distanceFactor={10}>
        <div className="text-white text-sm">{name}</div>
      </Html>
    </mesh>
  );
}

// Componente de órbita
function OrbitLine({ radius }) {
  const points = [];
  for (let i = 0; i <= 100; i++) {
    const angle = (i / 100) * Math.PI * 2;
    points.push([Math.cos(angle) * radius, 0, Math.sin(angle) * radius]);
  }
  return (
    <line>
      <bufferGeometry attach="geometry">
        <bufferAttribute attachObject={['attributes', 'position']} array={new Float32Array(points.flat())} itemSize={3} count={points.length} />
      </bufferGeometry>
      <lineBasicMaterial attach="material" color="white" />
    </line>
  );
}

// Componente principal del Orrery
function Orrery() {
  const [selectedBody, setSelectedBody] = useState(null);
  const cameraRef = useRef();

  // Función para manejar la selección de un objeto
  const handleClick = (body) => {
    setSelectedBody(body);
  };

  useFrame(({ camera }) => {
    // Si hay un cuerpo seleccionado, mover la cámara hacia ese cuerpo
    if (selectedBody) {
      camera.position.lerp(
        { x: selectedBody.position[0], y: selectedBody.position[1] + 2, z: selectedBody.position[2] + 4 },
        0.05
      );
      camera.lookAt(selectedBody.position[0], selectedBody.position[1], selectedBody.position[2]);
    }
  });

  // Función para cargar información del cuerpo celeste desde la API de la NASA
  const fetchBodyInfo = async (bodyName) => {
    try {
      const response = await axios.get(`https://api.nasa.gov/planetary/earth/assets`, {
        params: {
          api_key: 'DEMO_KEY', // Inserta tu API Key aquí
          lon: 100.75,
          lat: 1.5,
          date: '2022-03-01',
          dim: 0.10,
        },
      });
      console.log('Datos del cuerpo celeste:', response.data);
    } catch (error) {
      console.error('Error al obtener información:', error);
    }
  };

  return (
    <Canvas>
      {/* Iluminación */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />

      {/* Órbitas y objetos celestes */}
      {celestialBodies.map((body, index) => (
        <React.Fragment key={index}>
          <OrbitLine radius={body.position[0]} />
          <CelestialIcon
            position={body.position}
            name={body.name}
            onClick={() => {
              handleClick(body);
              fetchBodyInfo(body.info);
            }}
          />
        </React.Fragment>
      ))}

      {/* Controles de órbita */}
      <OrbitControls ref={cameraRef} />
    </Canvas>
  );
}

export default Orrery;
