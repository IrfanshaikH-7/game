export interface Benefit {
  id: number;
  name: string;
  description: string;
  effect: string;
}

export const benefits: Benefit[] = [
  {
    id: 1,
    name: "Lucky Steps",
    description: "Move forward 4 spaces",
    effect: "MOVE_FORWARD_4"
  },
//   {
//     id: 2,
//     name: "Checkpoint",
//     description: "Teleport to tile 20",
//     effect: "TELEPORT_20"
//   },
//   {
//     id: 3,
//     name: "Extra Roll",
//     description: "Roll the dice again!",
//     effect: "EXTRA_ROLL"
//   },
//   {
//     id: 4,
//     name: "Shield",
//     description: "Immunity from next trap",
//     effect: "TRAP_IMMUNITY"
//   },
//   {
//     id: 5,
//     name: "Power Move",
//     description: "Choose: move forward, draw blessing, or swap places",
//     effect: "CHOICE_POWER"
//   }
];
