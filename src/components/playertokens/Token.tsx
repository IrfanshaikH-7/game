import { useGLTF } from '@react-three/drei';
import { useEffect, useRef } from 'react';
import { Group } from 'three';

interface TokenProps {
  position: [number, number, number];
  modelPath: string;
  scale?: [number, number, number];
  rotation?: [number, number, number];
  heightOffset?: number;
}

const Token = ({ 
  position, 
  modelPath, 
  scale = [0.6, 0.6, 0.6],
  rotation = [0, 0, 0],
  heightOffset = 0
}: TokenProps) => {
  const groupRef = useRef<Group>(null);
  const modelRef = useRef<Group>(null);
  const { scene } = useGLTF(modelPath);

  // Calculate the adjusted position
  const adjustedPosition: [number, number, number] = [
    position[0],
    position[1] + heightOffset,
    position[2]
  ];

  useEffect(() => {
    if (groupRef.current && modelRef.current) {
      // Update the model's world position
      groupRef.current.position.set(...adjustedPosition);
      console.log(`Token ${modelPath} updating to position:`, {
        adjustedPosition,
        currentWorldPos: groupRef.current.getWorldPosition(groupRef.current.position.clone())
      });
    }
  }, [adjustedPosition, modelPath]);

  // Clone the scene for this instance
  const clonedScene = scene.clone();

  return (
    <group ref={groupRef}>
      <primitive 
        ref={modelRef}
        object={clonedScene}
        position={[0, 0, 0]}
        rotation={rotation}
        scale={scale}
      />
    </group>
  );
};

// Preload models
useGLTF.preload('/tokens/Stan.glb');
useGLTF.preload('/tokens/mons.glb');
useGLTF.preload('/tokens/robo.glb');
useGLTF.preload('/tokens/girl.glb');

export default Token; 