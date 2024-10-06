/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.5.2 A2007KE4.gltf 
*/

import React from 'react'
import { useGLTF } from '@react-three/drei'

export function A2007KE4(props) {
  const { nodes, materials } = useGLTF('/public/models/A2007KE4.gltf')
  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.Sphere.geometry} material={materials.Material} scale={[0.356, 1, 1]} />
    </group>
  )
}

useGLTF.preload('/public/models/A2007KE4.gltf')
