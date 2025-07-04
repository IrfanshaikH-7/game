import { usePlayerStore } from '../../store/usePlayerStore';
import mapData from '../maps/grassland.json';

// Common movement function for all movement effects
const movePlayer = (spaces: number) => {
  const store = usePlayerStore.getState();
  const activePlayer = store.getActivePlayer();
  
  if (!activePlayer || store.isMoving) return;
  
  const targetTile = activePlayer.currentTile + spaces;
  const maxTileId = Math.max(...mapData.tiles.filter(t => t.type === 'path' && t.id).map(t => t.id || 0));
  
  // Validate move is within bounds
  if (targetTile < 1 || targetTile > maxTileId) {
    console.log("Can't move that far!");
    return;
  }

  usePlayerStore.setState({ isMoving: true });
  
  // Generate sequence of tiles to move through
  const sequence = spaces > 0
    ? Array.from({ length: spaces }, (_, i) => activePlayer.currentTile + i + 1)
    : Array.from({ length: Math.abs(spaces) }, (_, i) => activePlayer.currentTile - i - 1);

  let step = 0;
  const moveNext = () => {
    if (step < sequence.length) {
      const nextTileNumber = sequence[step];
      store.updatePosition(activePlayer.id, nextTileNumber);
      
      step++;
      
      if (step === sequence.length) {
        // Check for surprises only on forward movement
        if (spaces > 0) {
          const landedTile = mapData.tiles.find(t => t.id === nextTileNumber);
          if (landedTile?.special === 'surprise') {
            setTimeout(() => {
              usePlayerStore.setState({ isMoving: false });
              document.dispatchEvent(new CustomEvent('showSurpriseModal'));
            }, 500);
            return; // Don't change turns yet, let the new surprise handle it
          }
        }
        // For backward movement or no surprise, end turn
        setTimeout(() => {
          usePlayerStore.setState({ isMoving: false });
          store.nextTurn();
        }, 500);
      } else {
        setTimeout(moveNext, 500);
      }
    }
  };

  moveNext();
};

// Movement effects
const moveBack3 = () => {
  console.log("Moving back 3 spaces");
  movePlayer(-3);
};

const moveForward4 = () => {
  console.log("Moving forward 4 spaces");
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
  console.log("Handling effect:", effect);
  const handler = effectHandlers[effect];
  if (handler) {
    handler();
    return true;
  }
  console.log("No handler found for effect:", effect);
  return false;
};
