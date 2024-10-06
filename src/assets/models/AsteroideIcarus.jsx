
import React from 'react'
import { useGLTF } from '@react-three/drei'

export function AsteroideIcarus(props) {
  const { nodes, materials } = useGLTF('/public/models/AsteroideIcarus.gltf')
  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.Sphere.geometry} material={materials['Material.001']} scale={[0.529, 1, 1]} />
    </group>
  )
}

useGLTF.preload('/public/models/AsteroideIcarus.gltf')
