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
    const newValue = Math.floor(Math.random() * 6) + 1;
    set({ diceValue: newValue });
    return newValue;
  },
  movePlayer: () => {
    const playerStore = usePlayerStore.getState();
    const activePlayer = playerStore.getActivePlayer();
    const diceValue = get().diceValue;
    
    if (!activePlayer) {
      console.log("No active player found");
      return;
    }

    console.log("Moving player:", activePlayer.id, "from tile", activePlayer.currentTile, "by", diceValue);
    
    // Calculate new tile number
    const nextTile = activePlayer.currentTile + diceValue;
    
    // Check if next tile exists and is within bounds
    const maxTileId = Math.max(...mapData.tiles.filter(t => t.type === 'path' && t.id).map(t => t.id || 0));
    
    if (nextTile <= maxTileId && !playerStore.isMoving) {
      usePlayerStore.setState({ isMoving: true });
      
      // Generate sequence of tiles from current to target
      const sequence = Array.from(
        { length: nextTile - activePlayer.currentTile },
        (_, i) => activePlayer.currentTile + i + 1
      );

      console.log("Movement sequence:", sequence);

      let step = 0;
      const moveNext = () => {
        if (step < sequence.length) {
          const nextTileNumber = sequence[step];
          console.log("Moving to tile:", nextTileNumber);
          playerStore.updatePosition(activePlayer.id, nextTileNumber);
          
          step++;
          
          if (step < sequence.length) {
            setTimeout(moveNext, 300);
          } else {
            // On last step
            const currentTile = mapData.tiles.find(t => t.id === nextTileNumber);
            if (currentTile?.special === 'surprise') {
              setTimeout(() => {
                document.dispatchEvent(new CustomEvent('showSurpriseModal', {
                  detail: { playerId: activePlayer.id }
                }));
              }, 300);
              // Turn will be changed after surprise effect completes
              usePlayerStore.setState({ isMoving: false });
            } else {
              // If no surprise, change turn normally
              setTimeout(() => {
                usePlayerStore.setState({ isMoving: false });
                playerStore.nextTurn();
              }, 500);
            }
          }
        }
      };

      moveNext();
    } else {
      if (nextTile > maxTileId) {
        console.log("Attempted to move beyond max tile:", maxTileId);
      }
      if (playerStore.isMoving) {
        console.log("Player is already moving");
      }
      // Don't change turns if movement is blocked due to isMoving
      if (!playerStore.isMoving) {
        playerStore.nextTurn();
      }
    }
  }
}));
