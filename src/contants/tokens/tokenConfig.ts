export interface TokenConfig {
  id: string;
  name: string;
  modelPath: string;
  scale?: [number, number, number];
  heightOffset?: number;
}

export const availableTokens: TokenConfig[] = [
 
  {
    id: 'mons',
    name: 'Mons',
    modelPath: '/tokens/mons.glb',
    scale: [0.4, 0.4, 0.4],
    heightOffset: 0.05
  },
  {
    id: 'stan',
    name: 'Stan',
    modelPath: '/tokens/Stan.glb',
    scale: [0.4, 0.4, 0.4],
    heightOffset: 0.05
  },
 
];

export const getTokenConfig = (id: string): TokenConfig | undefined => {
  return availableTokens.find(token => token.id === id);
}; 