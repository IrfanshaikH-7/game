import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlayerStore } from '../../store/usePlayerStore';
import { availableTokens } from '../../contants/tokens/tokenConfig';
import './Onboarding.css';

const PLAYER_COLORS = [
  '#FF0000', // Red
  '#0000FF', // Blue
  '#00FF00', // Green
  '#FFA500', // Orange
  '#800080', // Purple
  '#FFFF00', // Yellow
];

// Define the Player interface to match the store's interface
interface InitialPlayer {
  id: string;
  name: string;
  tokenId: string;
  color: string;
  isActive: boolean;
  effects: string[];
}

const Onboarding = () => {
  const navigate = useNavigate();
  const [numPlayers, setNumPlayers] = useState<number>(2);
  const [playerNames, setPlayerNames] = useState<string[]>(['', '', '', '']);
  const [playerTokens, setPlayerTokens] = useState<string[]>(
    Array(4).fill(availableTokens[0].id)
  );
  const [playerColors, setPlayerColors] = useState<string[]>(PLAYER_COLORS);

  const handleStartGame = () => {
    // Validate names are not empty
    const activePlayers = playerNames.slice(0, numPlayers);
    if (activePlayers.some(name => !name.trim())) {
      alert('Please enter names for all players');
      return;
    }

    console.log('Current token selections:', playerTokens);
    
    const players: InitialPlayer[] = activePlayers.map((name, index) => {
      const player = {
        id: `player-${index + 1}`,
        name,
        tokenId: playerTokens[index],
        color: playerColors[index],
        isActive: index === 0,
        effects: []
      };
      console.log(`Creating player:`, player);
      return player;
    });
    
    console.log('Initializing players with:', players);
    usePlayerStore.getState().initializePlayers(players);
    navigate('/game');
  };

  const handleColorChange = (index: number, color: string) => {
    const newColors = [...playerColors];
    // Swap colors between the current player and the one who already has this color
    const existingIndex = newColors.indexOf(color);
    if (existingIndex !== -1) {
      newColors[existingIndex] = newColors[index];
    }
    newColors[index] = color;
    setPlayerColors(newColors);
  };

  return (
    <div className="onboarding-container">
      <h1>Welcome to the Game!</h1>
      
      <div className="onboarding-section">
        <h2>Select Number of Players</h2>
        <select 
          value={numPlayers} 
          onChange={(e) => setNumPlayers(Number(e.target.value))}
          className="player-select"
        >
          <option value={2}>2 Players</option>
          <option value={3}>3 Players</option>
          <option value={4}>4 Players</option>
        </select>
      </div>

      <div className="onboarding-section">
        <h2>Enter Player Names</h2>
        {Array.from({ length: numPlayers }).map((_, index) => (
          <div key={index} className="player-setup">
            <input
              type="text"
              placeholder={`Player ${index + 1} Name`}
              value={playerNames[index]}
              onChange={(e) => {
                const newNames = [...playerNames];
                newNames[index] = e.target.value;
                setPlayerNames(newNames);
              }}
              className="name-input"
            />
            
            <div className="player-customization">
              <div className="token-selection">
                <h3>Select Token</h3>
                <div className="token-options">
                  {availableTokens.map((token) => (
                    <button
                      key={token.id}
                      className={`token-button ${playerTokens[index] === token.id ? 'selected' : ''}`}
                      onClick={() => {
                        const newTokens = [...playerTokens];
                        newTokens[index] = token.id;
                        console.log(`Player ${index + 1} selected ${token.name}. All tokens:`, newTokens);
                        setPlayerTokens(newTokens);
                      }}
                    >
                      {token.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="color-selection">
                <h3>Select Color</h3>
                <div className="color-options">
                  {PLAYER_COLORS.map((color) => (
                    <button
                      key={color}
                      className={`color-button ${playerColors[index] === color ? 'selected' : ''}`}
                      style={{ backgroundColor: color }}
                      onClick={() => handleColorChange(index, color)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="start-game-container">
        <button onClick={handleStartGame} className="start-button">
          Start Game
        </button>
      </div>
    </div>
  );
};

export default Onboarding;
