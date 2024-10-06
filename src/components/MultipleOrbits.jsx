import { useThree, extend } from '@react-three/fiber';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line, Text } from '@react-three/drei';
import * as THREE from 'three';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { ATierraMarck2 } from '../assets/models/ATierraMarck2';
import { ALuna } from '../assets/models/ALuna';
import { A20000SG344 } from '../assets/models/A20000SG344';
import { A2007KE4 } from '../assets/models/A2007KE4';
import { A2009JF1 } from '../assets/models/A2009JF1';
import { A2018VP1 } from '../assets/models/A2018VP1';
import { AATOM } from '../assets/models/AATOM';
import { Asteroide2006QU89 } from '../assets/models/Asteroide2006QU89';
import { Asteroide2007FT3 } from '../assets/models/Asteroide2007FT3';
import { Asteroide2008JL3 } from '../assets/models/Asteroide2008JL3';
import { Asteroide2011DU9 } from '../assets/models/Asteroide2011DU9';
import { Asteroide2017BM3 } from '../assets/models/Asteroide2017BM3';
import { AsteroideApolo } from '../assets/models/AsteroideApolo';
import { AsteroideIcarus } from '../assets/models/AsteroideIcarus';
import { AsteroideToro } from '../assets/models/AsteroideToro';

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
          <sphereGeometry args={[0.02, 32, 32]} />
        ) : (
          <Model scale={[0.05, 0.05, 0.05]}/>  // Mostrar modelo si está seleccionado
        )}
        <meshStandardMaterial color={sphereColor} />

        {/* Texto que sigue la cámara y está encima del objeto */}
        <Text ref={textRef} position={[0, 0.1, 0]} fontSize={0.03} color="white" anchorX="center" anchorY="middle">
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
  const controlsRef = useRef(); // Se usará para restaurar el control después de mover la cámara

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
      } else {
        // Reactivar los controles una vez que la cámara haya terminado de moverse
        if (controlsRef.current) {
          controlsRef.current.enabled = true; // Habilita los controles de nuevo
        }
      }
    }

    animate();
  };

  // Actualiza el `target` de los controles cuando hay un cambio en `targetPosition`
  useEffect(() => {
    if (targetPosition && orbitControls) {
      orbitControls.target.set(targetPosition.x, targetPosition.y, targetPosition.z);
      orbitControls.update(); // Actualizamos los OrbitControls

      // Desactiva los controles mientras se mueve la cámara
      if (controlsRef.current) {
        controlsRef.current.enabled = false;
      }

      moveCameraToTarget(targetPosition);  // Mueve la cámara hacia el objeto seleccionado
    }
  }, [targetPosition, orbitControls]);

  // Función para manejar el clic en un objeto
  const handleObjectClick = (id, position) => {
    onClick(id, position);  // Establecemos el objeto como target
  };

  return (
    <>
      <Sun />
      <ATierraMarck2 position={[0, 0, 0]} scale={[0.5, 0.5, 0.5]} />

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
        Model={ALuna}
        showModel={selectedObject === 1 && showModel}  // Mostrar modelo solo si está seleccionado
        onClick={handleObjectClick}
      />
      {/* A20000SG344 */}
      <OrbitalObject
        id={2007482}
        name="1994 PC1"
        semiMajorAxis={3.2}
        eccentricity={0.55}
        pitch={Math.PI / 7}
        yaw={Math.PI / 5}
        roll={Math.PI / 4}
        orbitColor="orange"
        sphereColor="red"
        Model={A20000SG344}
        showModel={selectedObject === 2007482 && showModel}  
        onClick={handleObjectClick}
      />

      {/* A2007KE4 */}
      <OrbitalObject
        id={2528157}
        name="2008 HS3"
        semiMajorAxis={2.8}
        eccentricity={0.58}
        pitch={Math.PI / 6}
        yaw={Math.PI / 5.5}
        roll={Math.PI / 4.5}
        orbitColor="yellow"
        sphereColor="yellow"
        Model={A2007KE4}
        showModel={selectedObject === 2528157 && showModel}  
        onClick={handleObjectClick}
      />

      {/* A2009JF1 */}
      <OrbitalObject
        id={3568303}
        name="2011 MD"
        semiMajorAxis={3.5}
        eccentricity={0.63}
        pitch={Math.PI / 7.5}
        yaw={Math.PI / 5.8}
        roll={Math.PI / 3.5}
        orbitColor="blue"
        sphereColor="blue"
        Model={A2009JF1}
        showModel={selectedObject === 3568303 && showModel}  
        onClick={handleObjectClick}
      />

      {/* A2018VP1 */}
      <OrbitalObject
        id={3542519}
        name="2010 PK9"
        semiMajorAxis={2.9}
        eccentricity={0.49}
        pitch={Math.PI / 6.5}
        yaw={Math.PI / 4.9}
        roll={Math.PI / 4.2}
        orbitColor="green"
        sphereColor="green"
        Model={A2018VP1}
        showModel={selectedObject === 3542519 && showModel}  
        onClick={handleObjectClick}
      />

      {/* AATOM */}
      <OrbitalObject
        id={3879280}
        name="2019 UK1"
        semiMajorAxis={3.1}
        eccentricity={0.59}
        pitch={Math.PI / 5.7}
        yaw={Math.PI / 5.2}
        roll={Math.PI / 4.7}
        orbitColor="purple"
        sphereColor="purple"
        Model={AATOM}
        showModel={selectedObject === 3879280 && showModel}  
        onClick={handleObjectClick}
      />

      {/* Asteroide2006QU89 */}
      <OrbitalObject
        id={3545901}
        name="2010 RKS3"
        semiMajorAxis={3.4}
        eccentricity={0.62}
        pitch={Math.PI / 7.3}
        yaw={Math.PI / 5.6}
        roll={Math.PI / 3.3}
        orbitColor="orange"
        sphereColor="orange"
        Model={Asteroide2006QU89}
        showModel={selectedObject === 3545901 && showModel}  
        onClick={handleObjectClick}
      />

      {/* Asteroide2007FT3 */}
      <OrbitalObject
        id={2002062}
        name="2062 ATEN"
        semiMajorAxis={3.3}
        eccentricity={0.57}
        pitch={Math.PI / 6.1}
        yaw={Math.PI / 5.4}
        roll={Math.PI / 3.7}
        orbitColor="yellow"
        sphereColor="yellow"
        Model={Asteroide2007FT3}
        showModel={selectedObject === 2002062 && showModel}  
        onClick={handleObjectClick}
      />

      {/* Asteroide2008JL3 */}
      <OrbitalObject
        id={2002340}
        name="2340 HATOR"
        semiMajorAxis={3.6}
        eccentricity={0.65}
        pitch={Math.PI / 8}
        yaw={Math.PI / 5.9}
        roll={Math.PI / 3.2}
        orbitColor="blue"
        sphereColor="blue"
        Model={Asteroide2008JL3}
        showModel={selectedObject === 2002340 && showModel}  
        onClick={handleObjectClick}
      />

      {/* Asteroide2011DU9 */}
      <OrbitalObject
        id={3799747}
        name="2018 DV1"
        semiMajorAxis={3.0}
        eccentricity={0.52}
        pitch={Math.PI / 6.8}
        yaw={Math.PI / 5.3}
        roll={Math.PI / 4.1}
        orbitColor="green"
        sphereColor="green"
        Model={Asteroide2011DU9}
        showModel={selectedObject === 3799747 && showModel}  
        onClick={handleObjectClick}
      />

      {/* Asteroide2017BM3 */}
      <OrbitalObject
        id={2001862}
        name="1862 APOLLO"
        semiMajorAxis={3.2}
        eccentricity={0.54}
        pitch={Math.PI / 6.3}
        yaw={Math.PI / 4.8}
        roll={Math.PI / 4.6}
        orbitColor="purple"
        sphereColor="purple"
        Model={Asteroide2017BM3}
        showModel={selectedObject === 2001862 && showModel}  
        onClick={handleObjectClick}
      />

      {/* AsteroideApolo */}
      <OrbitalObject
        id={2000433}
        name="433 EROS"
        semiMajorAxis={2.7}
        eccentricity={0.50}
        pitch={Math.PI / 6.2}
        yaw={Math.PI / 4.7}
        roll={Math.PI / 4.4}
        orbitColor="orange"
        sphereColor="orange"
        Model={AsteroideApolo}
        showModel={selectedObject === 2000433 && showModel}  
        onClick={handleObjectClick}
      />

      {/* AsteroideIcarus */}
      <OrbitalObject
        id={2001566}
        name="1566 ICARUS"
        semiMajorAxis={3.4}
        eccentricity={0.61}
        pitch={Math.PI / 7.4}
        yaw={Math.PI / 5.5}
        roll={Math.PI / 3.6}
        orbitColor="yellow"
        sphereColor="yellow"
        Model={AsteroideIcarus}
        showModel={selectedObject === 2001566 && showModel}  
        onClick={handleObjectClick}
      />

      {/* AsteroideToro */}
      <OrbitalObject
        id={371537}
        name="2015 FJ332"
        semiMajorAxis={3.1}
        eccentricity={0.53}
        pitch={Math.PI / 5.9}
        yaw={Math.PI / 4.9}
        roll={Math.PI / 4.3}
        orbitColor="red"
        sphereColor="red"
        Model={AsteroideToro}
        showModel={selectedObject === 371537 && showModel}  
        onClick={handleObjectClick}
      />

    </>
  );
}

export default MultipleOrbits;
