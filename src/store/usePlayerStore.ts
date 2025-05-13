import { create } from 'zustand';
import mapData from '../contants/maps/grassland.json';

interface PlayerState {
  currentTile: number;
  position: [number, number, number];
  isMoving: boolean;
  updatePosition: (tileNumber: number) => void;
}

// Find the starting tile (path with ID 1)
const startingTile = mapData.tiles.find(tile => tile.type === 'path' && tile.id === 1);

export const usePlayerStore = create<PlayerState>((set) => ({
  currentTile: 1,
  position: startingTile 
    ? [startingTile.path[0], 0.15, startingTile.path[1]]
    : [0, 0.15, 0],
  isMoving: false,
  updatePosition: (tileNumber) => {
    const newTile = mapData.tiles.find(tile => tile.id === tileNumber);
    if (newTile) {
      set({
        currentTile: tileNumber,
        position: [newTile.path[0], 0.15, newTile.path[1]]
      });
    }
  }
}));
