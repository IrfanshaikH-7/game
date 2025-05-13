import { useSpring, animated } from '@react-spring/three';
import { useEffect, useMemo } from 'react';
import Token from './playertokens/Token';
import type { TokenConfig } from '../contants/tokens/tokenConfig';

interface MovingTokenProps {
  position: [number, number, number];
  tokenConfig: TokenConfig;
  playerId?: string;
}

const MovingToken = ({ position, tokenConfig, playerId }: MovingTokenProps) => {
  // Create a unique spring configuration for each player
  const springConfig = useMemo(() => ({
    mass: 1,
    tension: 180,
    friction: 12
  }), []);

  // Calculate the actual world position
  const worldPosition = useMemo(() => {
    // All tokens should use the same coordinate system
    return [position[0], position[1], position[2]] as [number, number, number];
  }, [position]);

  const [{ xyz }, api] = useSpring(() => ({ 
    xyz: worldPosition,
    config: springConfig
  }));

  useEffect(() => {
    console.log(`Moving token ${tokenConfig.id} (${playerId}) to position:`, worldPosition);
    api.start({ xyz: worldPosition });
  }, [worldPosition, api, playerId, tokenConfig.id]);

  return (
    <animated.group position={xyz}>
      <Token
        position={[0, 0, 0]}
        modelPath={tokenConfig.modelPath}
        scale={tokenConfig.scale}
        heightOffset={tokenConfig.heightOffset}
      />
    </animated.group>
  );
};

export default MovingToken; 