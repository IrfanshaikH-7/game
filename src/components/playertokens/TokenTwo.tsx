// src/components/shared/TokenOne.tsx
import { useGLTF } from '@react-three/drei';

const TokenTwo = ({ position }: { position: [number, number, number] }) => {
  const pawnModel = useGLTF('/tokens/Stan.glb');

  return (
    <primitive 
      object={pawnModel.scene} 
      position={position} 
      scale={[0.005, 0.005, 0.005]}  // Very small scale to fit within a tile
    />
  );
};

export default TokenTwo;