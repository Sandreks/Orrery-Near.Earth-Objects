import { useThree, extend } from '@react-three/fiber';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line, Text } from '@react-three/drei';
import * as THREE from 'three';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { UnrealBloomPass } from 'three-stdlib';
import { Earth } from '../assets/models/Atierra';
import { Carus } from '../assets/models/AsteroideIcarus';

// Extiende OrbitControls para que sea usable en React
extend({ OrbitControls });

// Función para aplicar rotaciones
function applyRotation(points, angle, axis) {
  const rotationMatrix = new THREE.Matrix4();
  rotationMatrix.makeRotationAxis(axis, angle);
  return points.map((point) => point.clone().applyMatrix4(rotationMatrix));
}

// Función para generar la órbita elíptica
function generateEllipticalOrbit(a, e, pitch, yaw, roll) {
  const b = a * Math.sqrt(1 - e ** 2);  // Eje semi-menor
  const points = [];
  const totalPoints = 101; // Asegúrate de que el último punto cierre el bucle
  const uValues = Array.from({ length: totalPoints }, (_, i) => (2 * Math.PI * i) / (totalPoints - 1));

  uValues.forEach((u) => {
    const x = a * Math.cos(u);
    const y = b * Math.sin(u);
    points.push(new THREE.Vector3(x, y, 0));  // Elipse en el plano XY
  });

  // Aplicar rotaciones
  const rotatedPoints = applyRotation(points, pitch, new THREE.Vector3(0, 1, 0));
  const yawedPoints = applyRotation(rotatedPoints, yaw, new THREE.Vector3(0, 0, 1));
  return applyRotation(yawedPoints, roll, new THREE.Vector3(1, 0, 0));
}

// Componente para los objetos con su esfera o modelo 3D
function OrbitalObject({ id, name, semiMajorAxis, eccentricity, pitch, yaw, roll, orbitColor, sphereColor, Model, showModel, onClick }) {
  const points = generateEllipticalOrbit(semiMajorAxis, eccentricity, pitch, yaw, roll);
  const objectRef = useRef();
  const textRef = useRef();

  // El texto sigue a la cámara
  useFrame(({ camera }) => {
    if (textRef.current) {
      textRef.current.quaternion.copy(camera.quaternion);
    }
  });

  return (
    <>
      {/* Dibuja la órbita */}
      <Line points={points} color={orbitColor} />

      {/* Modelo estático o esfera dependiendo del estado */}
      <mesh ref={objectRef} castShadow position={points[0]} onClick={() => onClick(id, objectRef.current.position)}>
        {!showModel ? (  // Mostrar esfera si no está seleccionado
          <sphereGeometry args={[0.05, 32, 32]} />
        ) : (
          <Model scale={[0.05, 0.05, 0.05]}/>  // Mostrar modelo si está seleccionado
        )}
        <meshStandardMaterial color={sphereColor} />

        {/* Texto que sigue la cámara y está encima del objeto */}
        <Text ref={textRef} position={[0, 0.3, 0]} fontSize={0.07} color="white" anchorX="center" anchorY="middle">
          {name}
        </Text>
      </mesh>
    </>
  );
}


// Componente del Sol
function Sun() {
  return (
    <>
      <mesh position={[-50, 0, 0]} castShadow scale={[5, 5, 5]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="yellow" emissive="orange" emissiveIntensity={0.8} />
      </mesh>
      <pointLight position={[-50, 0, 0]} intensity={20} distance={1000} castShadow />
      <EffectComposer>
        <Bloom
          intensity={0.2}  // Ajusta la intensidad del bloom (resplandor)
          luminanceThreshold={0.2} // Límite para activar el bloom
          luminanceSmoothing={0.3}  // Suavizar el efecto de bloom
          height={300}  // Tamaño de la textura del efecto bloom
        />
      </EffectComposer>
    </>
  );
}

// Componente para manejar la cámara y los objetos en órbita
function MultipleOrbits({ onClick, showModel, selectedObject, targetPosition, orbitControls }) {
  const { camera } = useThree();

  // Función para mover la cámara suavemente hacia el objeto seleccionado
  const moveCameraToTarget = (target) => {
    const start = new THREE.Vector3().copy(camera.position);
    const end = new THREE.Vector3().copy(target);
    const duration = 1000;  // Duración en milisegundos para el movimiento
    const startTime = performance.now();

    function animate() {
      const elapsedTime = performance.now() - startTime;
      const t = Math.min(elapsedTime / duration, 1);  // Asegura que t esté entre 0 y 1
      const lerpedPosition = new THREE.Vector3().lerpVectors(start, end, t);
      camera.position.copy(lerpedPosition);

      if (t < 1) {
        requestAnimationFrame(animate);  // Continua la animación hasta completar el movimiento
      }
    }

    animate();
  };

  // Actualiza el `target` de los controles cuando hay un cambio en `targetPosition`
  useEffect(() => {
    if (targetPosition && orbitControls) {
      // Establecemos el target correctamente con el método 'set'
      orbitControls.target.set(targetPosition.x, targetPosition.y, targetPosition.z);
      orbitControls.update(); // Actualizamos los OrbitControls
      moveCameraToTarget(targetPosition);  // Mueve la cámara hacia el objeto seleccionado
    }
  }, [targetPosition, orbitControls]);

  // Función para manejar el clic en un objeto
  const handleObjectClick = (id, position) => {
    console.log("Position:" + position.x + "-" + position.y + "-" + position.z);
    onClick(id, position);  // Establecemos el objeto como target
  };

  return (
    <>
      <Sun />
      <Earth position={[0, 0, 0]} scale={[0.5, 0.5, 0.5]} />

      {/* Luna */}
      <OrbitalObject
        id={1}
        name="Luna"
        semiMajorAxis={2}
        eccentricity={0.0549}
        pitch={Math.PI / 5}
        yaw={Math.PI / 4}
        roll={Math.PI / 6}
        orbitColor="white"
        sphereColor="white"
        Model={Carus}
        showModel={selectedObject === 1 && showModel}  // Mostrar modelo solo si está seleccionado
        onClick={handleObjectClick}
      />

      {/* Cometa */}
      <OrbitalObject
        id={2}
        name="Cometa"
        semiMajorAxis={5}
        eccentricity={0.9}
        pitch={Math.PI / 8}
        yaw={Math.PI / 6}
        roll={Math.PI / 4}
        orbitColor="yellow"
        sphereColor="yellow"
        Model={Carus}
        showModel={selectedObject === 2 && showModel}  
        onClick={handleObjectClick}
      />

      {/* Asteroide */}
      <OrbitalObject
        id={3}
        name="Asteroide"
        semiMajorAxis={3}
        eccentricity={0.6}
        pitch={Math.PI / 7}
        yaw={Math.PI / 5}
        roll={Math.PI / 3}
        orbitColor="orange"
        sphereColor="orange"
        Model={Carus}
        showModel={selectedObject === 3 && showModel}  
        onClick={handleObjectClick}
      />
    </>
  );
}

export default MultipleOrbits;
