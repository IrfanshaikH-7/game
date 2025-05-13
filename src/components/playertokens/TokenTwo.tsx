// src/components/shared/TokenTwo.tsx
import { useGLTF } from '@react-three/drei';

const TokenTwo = ({ position }: { position: [number, number, number] }) => {
  const model = useGLTF('/tokens/mons.glb');

  return (
    <primitive 
      object={model.scene} 
      position={[position[0], position[1] + 0.15, position[2]]}
      scale={[0.6, 0.6, 0.6]}
    />
  );
};

useGLTF.preload('/tokens/mons.glb');

export default TokenTwo;