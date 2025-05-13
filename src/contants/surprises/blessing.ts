export interface Blessing {
  id: number;
  name: string;
  description: string;
  effect: string;
}

export const blessings: Blessing[] = [
  {
    id: 1,
    name: "Truth Seeker",
    description: "Ask any question to a player (must answer truthfully)",
    effect: "ASK_QUESTION"
  },
  {
    id: 2,
    name: "Dare Master",
    description: "Dare a player to do something",
    effect: "GIVE_DARE"
  },
  {
    id: 3,
    name: "Trade Deal",
    description: "Trade a power-up with any player",
    effect: "TRADE_POWERUP"
  },
  {
    id: 4,
    name: "Popularity Contest",
    description: "All players vote: winner moves 5 steps forward",
    effect: "VOTE_MOVE"
  },
  {
    id: 5,
    name: "Time Stop",
    description: "Choose a player to freeze for 1 round",
    effect: "FREEZE_PLAYER"
  }
];
