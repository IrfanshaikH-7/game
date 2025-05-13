import { useSpring, animated } from '@react-spring/three';
import TokenOne from './playertokens/TokenOne';

const Player = ({ position }: { position: [number, number, number] }) => {
  // Create spring animation for smooth movement
  const { position: animatedPosition } = useSpring({
    position: position,
    config: { mass: 1, tension: 120, friction: 14 }, // Adjust these values for different movement feels
    delay: 300 // Small delay to start moving after dice roll
  });

  return (
    <animated.group position={animatedPosition}>
      <TokenOne position={[0, 0.15, 0]} />
    </animated.group>
  );
};

export default Player;
