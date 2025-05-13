import { useSpring, animated } from '@react-spring/three';
import TokenOne from './playertokens/TokenOne';
import TokenTwo from './playertokens/TokenTwo';
import { useEffect } from 'react';

const Player = ({ position, token }: { position: [number, number, number]; token: string }) => {
  const [springs, api] = useSpring(() => ({
    position: position,
    config: { mass: 1, tension: 170, friction: 26 }
  }));

  useEffect(() => {
    console.log(`Player rendering with token type: ${token}`);
    api.start({ position });
  }, [position, api, token]);

  // Explicitly render different components based on token type
  if (token === 'TokenTwo') {
    return (
      <animated.group position={springs.position}>
        <TokenTwo position={[0, 0.15, 0]} />
      </animated.group>
    );
  }

  return (
    <animated.group position={springs.position}>
      <TokenOne position={[0, 0.15, 0]} />
    </animated.group>
  );
};

export default Player;
