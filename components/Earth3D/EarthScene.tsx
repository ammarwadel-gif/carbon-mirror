'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

function EarthMesh({ carbonLevel }: { carbonLevel: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const color = useMemo(() => {
    const hue = 0.3 - (carbonLevel / 100) * 0.3;
    return new THREE.Color().setHSL(hue, 0.8, 0.5);
  }, [carbonLevel]);
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002;
    }
  });
  
  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[2, 64, 64]} />
      <meshStandardMaterial 
        color={color}
        metalness={0.1}
        roughness={0.5}
        emissive={carbonLevel > 70 ? '#ff3300' : '#000000'}
        emissiveIntensity={Math.min(carbonLevel / 100, 0.5)}
      />
    </mesh>
  );
}

export default function EarthScene({ carbonLevel = 25 }: { carbonLevel: number }) {
  return (
    <div style={{ width: '100%', height: '100vh', background: '#000011' }}>
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 3, 5]} intensity={1} />
        <pointLight position={[-3, 2, 4]} intensity={0.5} />
        <EarthMesh carbonLevel={carbonLevel} />
        <OrbitControls enableZoom={true} enablePan={false} />
      </Canvas>
    </div>
  );
}