/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.5.2 AsteroideToro.gltf 
*/

import React from 'react'
import { useGLTF } from '@react-three/drei'

export function AsteroideToro(props) {
  const { nodes, materials } = useGLTF('/public/models/AsteroideToro.gltf')
  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.Sphere.geometry} material={materials['Material.001']} scale={[0.517, 1.157, 1]} />
    </group>
  )
}

useGLTF.preload('/public/models/AsteroideToro.gltf')
