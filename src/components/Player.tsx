import MovingToken from './MovingToken';
import PlayerIndicator from './PlayerIndicator';
import { getTokenConfig } from '../contants/tokens/tokenConfig';

interface PlayerProps {
  position: [number, number, number];
  tokenId: string;
  color: string;
  id: string;
}

const Player = ({ position, tokenId, color, id }: PlayerProps) => {
  const tokenConfig = getTokenConfig(tokenId);
  
  if (!tokenConfig) {
    console.error(`Token configuration not found for id: ${tokenId}`);
    return null;
  }

  // Base position for the token (on the tile)
  const tokenPos: [number, number, number] = [
    position[0],
    position[1], // Use the height from the position prop
    position[2]
  ];

  // Calculate indicator position
  const indicatorPos: [number, number, number] = [
    position[0],
    0.2, // Higher above the tile
    position[2]
  ];

  return (
    <>
      <MovingToken 
        position={tokenPos}
        tokenConfig={tokenConfig}
        playerId={id}
      />
      <PlayerIndicator 
        position={indicatorPos}
        color={color}
      />
    </>
  );
};

export default Player;
