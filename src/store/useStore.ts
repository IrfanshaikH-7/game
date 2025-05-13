import { create } from 'zustand';
import { usePlayerStore } from './usePlayerStore';
import mapData from '../contants/maps/grassland.json';

interface DiceStore {
  diceValue: number;
  rollDice: () => number;
  movePlayer: () => void;
}

export const useStore = create<DiceStore>((set, get) => ({
  diceValue: 1,
  rollDice: () => {
    const newValue = Math.floor(Math.random() * 6) + 1; // Random number between 1 and 6
    set({ diceValue: newValue }); // Update the state
    return newValue; // Return the new value
  },
  movePlayer: () => {
    const { currentTile, updatePosition, isMoving } = usePlayerStore.getState();
    const diceValue = get().diceValue;
    
    // Calculate new tile number
    const nextTile = currentTile + diceValue;
    
    // Check if next tile exists and is within bounds (max 45)
    const maxTileId = Math.max(...mapData.tiles.filter(t => t.type === 'path' && t.id).map(t => t.id || 0));
    if (nextTile <= maxTileId && !isMoving) {
      usePlayerStore.setState({ isMoving: true });
      
      // Generate sequence of tiles from current to target
      const sequence = Array.from(
        { length: nextTile - currentTile },
        (_, i) => currentTile + i + 1
      );

      let step = 0;
      const moveNext = () => {
        if (step < sequence.length) {
          const nextTileNumber = sequence[step];
          updatePosition(nextTileNumber);
          
          // Only check for surprise on the final step
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
    } else {
      // Handle case when dice roll would move player beyond the last tile
      console.log("Can't move that far!");
    }
  }
}));
