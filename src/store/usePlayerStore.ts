import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import mapData from '../contants/maps/grassland.json';

interface Player {
  id: string;
  name: string;
  position: [number, number, number];
  tokenId: string;
  color: string;
  isActive: boolean;
  currentTile: number;
}

interface PlayerState {
  players: Player[];
  isMoving: boolean;
  initializePlayers: (players: Omit<Player, 'position' | 'currentTile'>[]) => void;
  updatePosition: (playerId: string, tileNumber: number) => void;
  nextTurn: () => void;
  getActivePlayer: () => Player | undefined;
}

// Find the starting tile (path with ID 1)
const startingTile = mapData.tiles.find(tile => tile.type === 'path' && tile.id === 1);
console.log('Starting tile found:', startingTile);

const startingPosition: [number, number, number] = startingTile 
  ? [startingTile.path[0], 0.15, startingTile.path[1]]
  : [0, 0.15, 0];

console.log('Initial starting position:', startingPosition);

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set, get) => ({
      players: [],
      isMoving: false,

      initializePlayers: (players) => {
        const initializedPlayers = players.map(player => {
          console.log(`Initializing player ${player.name} with token ${player.tokenId}`);
          return {
            ...player,
            position: [...startingPosition] as [number, number, number],
            currentTile: 1
          };
        });
        console.log('All initialized players:', initializedPlayers);
        set({ players: initializedPlayers });
      },

      updatePosition: (playerId, tileNumber) => {
        const newTile = mapData.tiles.find(tile => tile.id === tileNumber);
        if (newTile) {
          const newPosition: [number, number, number] = [newTile.path[0], 0.15, newTile.path[1]];
          console.log(`Store: Updating player ${playerId} to tile ${tileNumber}`, {
            tile: newTile,
            path: newTile.path,
            calculatedPosition: newPosition
          });
          
          set(state => {
            const newPlayers = state.players.map(player => {
              if (player.id === playerId) {
                console.log(`Store: Player ${player.name} (${player.tokenId})`, {
                  from: player.position,
                  to: newPosition,
                  tile: tileNumber
                });
                return {
                  ...player,
                  currentTile: tileNumber,
                  position: newPosition
                };
              }
              return player;
            });
            
            return { players: newPlayers };
          });
        } else {
          console.warn(`Store: Could not find tile ${tileNumber} in:`, mapData.tiles);
        }
      },

      nextTurn: () => {
        set(state => {
          const currentPlayerIndex = state.players.findIndex(p => p.isActive);
          const nextPlayerIndex = (currentPlayerIndex + 1) % state.players.length;
          
          return {
            players: state.players.map((player, index) => ({
              ...player,
              isActive: index === nextPlayerIndex
            }))
          };
        });
      },

      getActivePlayer: () => {
        const player = get().players.find(p => p.isActive);
        console.log('Current active player:', player);
        return player;
      }
    }),
    {
      name: 'game-storage',
      partialize: (state) => ({ players: state.players })
    }
  )
);
