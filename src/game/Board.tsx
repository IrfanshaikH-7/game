import { type JSX, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Box, OrbitControls, Text, RoundedBox, Cylinder, useTexture, useGLTF } from '@react-three/drei';
import { Group } from 'three';
import mapData from '../contants/maps/grassland.json'; // Adjust the path as necessary
import tileTypesConfig from '../contants/types/tileTyles';
import Player from '../components/Player';
import { usePlayerStore } from '../store/usePlayerStore';
import SurpriseModal from '../components/shared/SurpriseModal/SurpriseModal';
import { handleEffect } from '../contants/surprises/surpriseHandler';

// Define tile types and their colors/textures
type TileType = 'grass' | 'path' | 'tree' | 'water';

type GLTFResult = {
  scene: Group;
  nodes: any;
  materials: any;
};

const Tile = ({ position, type, id, special }: { position: any; type: TileType; id?: number; special?: string }) => {
  // Modified texture loading to handle special paths
  const texture = (() => {
    if (type === 'path' && special === 'surprise') {
      return useTexture(tileTypesConfig.tileTypes.surprise_path.texture!);
    }
    if (type === 'tree' || tileTypesConfig.tileTypes[type].type === 'texture') {
      return useTexture(tileTypesConfig.tileTypes[type].texture!);
    }
    return null;
  })();

  // Load model if tile type uses model
  const model = tileTypesConfig.tileTypes[type].type === 'model' && tileTypesConfig.tileTypes[type].model
    ? useGLTF(tileTypesConfig.tileTypes[type].model!) as GLTFResult
    : null;

  // Clone the scene for each tree instance
  const clonedScene = model?.scene.clone();

  // console.log('Type:', type, 'Texture:', texture); // Debug log

  // Check if tile is a corner
  const isCorner = type === 'grass' && (
    (position[0] === 0 && position[2] === 0) ||                  // Top-left
    (position[0] === 0 && position[2] === mapData.height - 1) || // Bottom-left
    (position[0] === mapData.width - 1 && position[2] === 0) ||  // Top-right
    (position[0] === mapData.width - 1 && position[2] === mapData.height - 1)  // Bottom-right
  );

  return (
    <group position={position}>
      {/* Main Tile */}
      <Box args={[1, 0.3, 1]} position={[0, 0, 0]}>
        <meshStandardMaterial 
          attach="material" 
          color={tileTypesConfig.tileTypes[type].color}
          map={texture}
        />
      </Box>

      {/* Model if applicable */}
      {model && (
        <primitive 
          object={clonedScene || model.scene} 
          position={[0, 1.4, 0]}
          scale={[0.3, 0.3, 0.3]}
        />
      )}

      {/* Corner piece for corner tiles */}
      {isCorner && (
        <Cylinder 
          args={[0.35, 0.35, 0.31, 32]}
          position={[
            position[0] === 0 ? -0.35 : 0.35,
            0,
            position[2] === 0 ? -0.35 : 0.35
          ]}
          rotation={[0, Math.PI / 4, 0]}
        >
          <meshStandardMaterial 
            attach="material" 
            color={tileTypesConfig.tileTypes[type].color}
            map={texture}
          />
        </Cylinder>
      )}

      {/* Text for path tiles */}
      {type === 'path' && id !== undefined && (
        <Text 
          position={[0, 0.25, 0]} 
          fontSize={0.3} 
          color="gray"
          rotation={[-1, 0, 0]} 
          anchorX="center" 
          anchorY="middle"
        >
          {id}
        </Text>
      )}
    </group>
  );
};

const IsometricBoard = () => {
  const position = usePlayerStore((state) => state.position);
  const tiles: JSX.Element[] = [];
  const [showSurpriseModal, setShowSurpriseModal] = useState(false);

  useEffect(() => {
    const handleSurpriseEvent = () => {
      setShowSurpriseModal(true);
    };

    document.addEventListener('showSurpriseModal', handleSurpriseEvent);
    return () => {
      document.removeEventListener('showSurpriseModal', handleSurpriseEvent);
    };
  }, []);

  const handleSurpriseEffect = (effect: string) => {
    console.log("Surprise effect:", effect);
    handleEffect(effect);
  };

  // Create a full 10x10 grid
  for (let row = 0; row < mapData.height; row++) {
    for (let col = 0; col < mapData.width; col++) {
      const tile = mapData.tiles.find(t => t.path[0] === col && t.path[1] === row);
      if (tile?.type === 'tree') {
        console.log('Found tree at:', col, row);
      }
      const type = tile ? tile.type : mapData.defaultTile;
      const id = tile?.id;
      tiles.push(<Tile key={`${col}-${row}`} position={[col, 0, row]} type={type as TileType} id={id} special={tile?.special} />);
    }
  }

  return (
    <div style={{ position: 'relative', height: '100vh' }}>
      <Canvas camera={{ position: [-8, 10, 15], fov: 40 }} shadows>
        <ambientLight intensity={0.7} />
        <pointLight position={[10, 10, 10]} castShadow intensity={1.5} />
        
        <RoundedBox 
          args={[mapData.width, 2, mapData.height]}
          radius={0.2}
          smoothness={4}
          position={[mapData.width / 2 - 0.5, -1.2, mapData.height / 2 - 0.5]}
        >
          <meshStandardMaterial 
            attach="material" 
            color="saddlebrown"
            roughness={0.8}
            metalness={0.2}
          />
        </RoundedBox>

        {tiles}
        <Player position={position} />
        <OrbitControls 
          minDistance={5} 
          maxDistance={50} 
          enablePan={false}
          maxPolarAngle={Math.PI / 2.5}
          minPolarAngle={Math.PI / 4}
          maxAzimuthAngle={Math.PI / 8}
          minAzimuthAngle={-Math.PI / 8}
          target={[mapData.width / 2, 0, mapData.height / 2]}
        />
      </Canvas>

      <SurpriseModal 
        isOpen={showSurpriseModal}
        onClose={() => setShowSurpriseModal(false)}
        onEffectComplete={handleSurpriseEffect}
      />
    </div>
  );
};

export default IsometricBoard;
