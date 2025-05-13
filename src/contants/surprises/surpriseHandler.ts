import { usePlayerStore } from '../../store/usePlayerStore';
import mapData from '../maps/grassland.json';

// Common movement function for all movement effects
const movePlayer = (spaces: number) => {
  const { currentTile, updatePosition, isMoving } = usePlayerStore.getState();
  
  if (isMoving) return;
  
  const targetTile = currentTile + spaces;
  const maxTileId = Math.max(...mapData.tiles.filter(t => t.type === 'path' && t.id).map(t => t.id || 0));
  
  // Validate move is within bounds
  if (targetTile < 1 || targetTile > maxTileId) {
    console.log("Can't move that far!");
    return;
  }

  usePlayerStore.setState({ isMoving: true });
  
  // Generate sequence of tiles to move through
  const sequence = spaces > 0
    ? Array.from({ length: spaces }, (_, i) => currentTile + i + 1)
    : Array.from({ length: Math.abs(spaces) }, (_, i) => currentTile - i - 1);

  let step = 0;
  const moveNext = () => {
    if (step < sequence.length) {
      const nextTileNumber = sequence[step];
      updatePosition(nextTileNumber);
      
      // Check for surprise tile on the final step
      if (step === sequence.length - 1) {
        const currentTile = mapData.tiles.find(t => t.id === nextTileNumber);
        if (currentTile?.special === 'surprise') {
          setTimeout(() => {
            document.dispatchEvent(new CustomEvent('showSurpriseModal'));
          }, 1500);
        }
      }
      
      step++;
      setTimeout(moveNext, 500);
    } else {
      usePlayerStore.setState({ isMoving: false });
    }
  };

  moveNext();
};

// Movement effects
const moveBack3 = () => {
  movePlayer(-3);
};

const moveForward4 = () => {
  movePlayer(4);
};

// Map of effect names to their handler functions
export const effectHandlers: { [key: string]: () => void } = {
  MOVE_BACK_3: moveBack3,
  MOVE_FORWARD_4: moveForward4,
  // We'll add more handlers later as we implement them
};

// Function to handle any effect
export const handleEffect = (effect: string): boolean => {
  const handler = effectHandlers[effect];
  if (handler) {
    handler();
    return true;
  }
  return false;
};
