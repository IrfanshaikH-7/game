import { useRef } from 'react';
import { Mesh } from 'three';

interface PlayerIndicatorProps {
  position: [number, number, number];
  color: string;
}

const PlayerIndicator = ({ position, color }: PlayerIndicatorProps) => {
  const meshRef = useRef<Mesh>(null);

  return (
    <mesh
      ref={meshRef}
      position={position}
      rotation={[0, Math.PI / 4, 0]}
    >
      <cylinderGeometry args={[0.15, 0.15, 0.1, 32]} />
      <meshStandardMaterial 
        color={color} 
        emissive={color}
        emissiveIntensity={0.5}
        transparent={true}
        opacity={0.8}
      />
    </mesh>
  );
};

export default PlayerIndicator; 