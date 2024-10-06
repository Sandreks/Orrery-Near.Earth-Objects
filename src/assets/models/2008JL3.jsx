import React from 'react'
import { useGLTF } from '@react-three/drei'

export function JS3_2008(props) {
  const { nodes, materials } = useGLTF('/public/models/2008_JL3.gltf')
  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.Cube.geometry} material={materials.Material} />
    </group>
  )
}

useGLTF.preload('/public/models/2008_JL3.gltf')
