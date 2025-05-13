export interface Trap {
  id: number;
  name: string;
  description: string;
  effect: string;
}

export const traps: Trap[] = [
  {
    id: 1,
    name: "Quicksand",
    description: "You're sinking! Go back 3 spaces",
    effect: "MOVE_BACK_3"
  },
  {
    id: 2,
    name: "Frozen Dice",
    description: "Your dice is frozen! Only roll 1 for next 2 turns",
    effect: "FREEZE_DICE_2_TURNS"
  },
  {
    id: 3,
    name: "Position Swap",
    description: "Swap positions with the last player",
    effect: "SWAP_WITH_LAST"
  },
  {
    id: 4,
    name: "Skip Turn",
    description: "Miss your next turn",
    effect: "SKIP_NEXT_TURN"
  },
  {
    id: 5,
    name: "Random Teleport",
    description: "Teleport to a random position",
    effect: "RANDOM_TELEPORT"
  }
];
