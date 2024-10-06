import { Line } from '@react-three/drei';
import * as THREE from 'three';
import { JS3_2008 } from '../assets/models/2008JL3'; // Modelo de un asteroide, por ejemplo
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { UnrealBloomPass } from 'three-stdlib';
import { Carus } from '../assets/models/AsteroideIcarus';

// Función para aplicar rotaciones
function applyRotation(points, angle, axis) {
  const rotationMatrix = new THREE.Matrix4();
  rotationMatrix.makeRotationAxis(axis, angle);

  return points.map((point) => point.clone().applyMatrix4(rotationMatrix));
}

// Función para generar una órbita elíptica
function generateEllipticalOrbit(a, e, pitch, yaw, roll, color = "red") {
  const b = a * Math.sqrt(1 - e ** 2); // semi-minor axis

  // Generar puntos de la elipse
  const points = [];
  const uValues = Array.from({ length: 80 }, (_, i) => -Math.PI + (2 * Math.PI * i) / 80);

  uValues.forEach((u) => {
    const x = a * Math.cos(u);
    const y = b * Math.sin(u);
    points.push(new THREE.Vector3(x, y, 0)); // Elipse plana en el plano XY
  });

  // Aplicar rotación de pitch (alrededor del eje Y)
  const rotatedPoints = applyRotation(points, pitch, new THREE.Vector3(0, 1, 0));

  // Aplicar rotación de yaw (alrededor del eje Z)
  const yawedPoints = applyRotation(rotatedPoints, yaw, new THREE.Vector3(0, 0, 1));

  // Aplicar rotación de roll (alrededor del eje X)
  const finalPoints = applyRotation(yawedPoints, roll, new THREE.Vector3(1, 0, 0));

  return <Line points={finalPoints} color={color} />;
}

// Componente que representa una órbita y un objeto que orbita
function OrbitalObject({ name, semiMajorAxis, eccentricity, pitch, yaw, roll, model: Model, color }) {
  // Calcular la posición del foco de la órbita (centro del objeto central)
  const focusX = semiMajorAxis * eccentricity;
  const focusY = 0;

  return (
    <>
      {/* Dibujar la órbita */}
      {generateEllipticalOrbit(semiMajorAxis, eccentricity, pitch, yaw, roll, color)}

      {/* Colocar el objeto orbitando */}
      <mesh position={[focusX, focusY, 0]} castShadow scale={[0.05, 0.05, 0.05]}>
        <Model />
      </mesh>
    </>
  );
}

// Componente para el Sol con luz y sombras
// Componente para el Sol con luz y sombras
function Sun() {
  return (
    <>
      {/* Representación del Sol */}
      <mesh position={[-7, 0, 0]} castShadow>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="yellow" emissive="orange" emissiveIntensity={0.8} />
      </mesh>

      {/* Luz puntual que emite desde el Sol */}
      <pointLight
        position={[-7, 0, 0]}  // Sol en la parte superior izquierda
        intensity={20}             // Ajusta la intensidad de la luz
        distance={500}            // Rango de la luz
        castShadow
        shadow-mapSize-width={1024} // Ajusta el tamaño del mapa de sombras
        shadow-mapSize-height={1024}
      />
      <EffectComposer>
        <Bloom
          intensity={1.5}  // Ajusta la intensidad del bloom (resplandor)
          luminanceThreshold={0.2} // Límite para activar el bloom
          luminanceSmoothing={0.3}  // Suavizar el efecto de bloom
          height={300}  // Tamaño de la textura del efecto bloom
        />
      </EffectComposer>
    </>
  );
}


// Componente principal para todas las órbitas cerca de la Tierra
function MultipleOrbits() {
  return (
    <>
      {/* Sol en el centro con luz */}
      <Sun />

      {/* Orbita de la Luna */}
      <OrbitalObject
        name="Luna"
        semiMajorAxis={2} // Distancia promedio entre la Tierra y la Luna en unidades arbitrarias
        eccentricity={0.0549}
        pitch={Math.PI / 5}
        yaw={Math.PI / 4}
        roll={Math.PI / 6}
        model={Carus}
        color="gray"
      />

      {/* Orbita de un cometa */}
      <OrbitalObject
        name="Cometa"
        semiMajorAxis={5} // Distancia promedio para el cometa en unidades arbitrarias
        eccentricity={0.9}
        pitch={Math.PI / 8}
        yaw={Math.PI / 6}
        roll={Math.PI / 4}
        model={JS3_2008}
        color="yellow"
      />

      {/* Orbita de un asteroide */}
      <OrbitalObject
        name="Asteroide"
        semiMajorAxis={3}
        eccentricity={0.6}
        pitch={Math.PI / 7}
        yaw={Math.PI / 5}
        roll={Math.PI / 3}
        model={JS3_2008} // Tu modelo de asteroide
        color="orange"
      />

      {/* Puedes seguir agregando más órbitas y objetos como sea necesario */}
    </>
  );
}

export default MultipleOrbits;
