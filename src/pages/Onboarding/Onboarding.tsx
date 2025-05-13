import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlayerStore } from '../../store/usePlayerStore';
import './Onboarding.css';

// Define the Player interface to match the store's interface
interface InitialPlayer {
  id: string;
  name: string;
  token: string;
  isActive: boolean;
  effects: string[];
}

const Onboarding = () => {
  const navigate = useNavigate();
  const [numPlayers, setNumPlayers] = useState<number>(2);
  const [playerNames, setPlayerNames] = useState<string[]>(['', '', '', '']);
  const [playerTokens, setPlayerTokens] = useState<string[]>(['TokenOne', 'TokenTwo', 'TokenOne', 'TokenTwo']);

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
        token: playerTokens[index],
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

  return (
    <div className="onboarding-container">
      <h1>Welcome to the Game!</h1>
      
      <div className="onboarding-section">
        <h2>Select Number of Players</h2>
        <select 
          value={numPlayers} 
          onChange={(e) => setNumPlayers(Number(e.target.value))}
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
            
            <div>
              <h3>Select Token</h3>
              <div>
                <button 
                  className={`token-button ${playerTokens[index] === 'TokenOne' ? 'selected' : ''}`}
                  onClick={() => {
                    const newTokens = [...playerTokens];
                    newTokens[index] = 'TokenOne';
                    console.log(`Player ${index + 1} selected TokenOne. All tokens:`, newTokens);
                    setPlayerTokens(newTokens);
                  }}
                >
                  Token 1
                </button>
                <button 
                  className={`token-button ${playerTokens[index] === 'TokenTwo' ? 'selected' : ''}`}
                  onClick={() => {
                    const newTokens = [...playerTokens];
                    newTokens[index] = 'TokenTwo';
                    console.log(`Player ${index + 1} selected TokenTwo. All tokens:`, newTokens);
                    setPlayerTokens(newTokens);
                  }}
                >
                  Token 2
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button onClick={handleStartGame} style={{ padding: '10px 20px', marginBottom: '20px' }}>
        Start Game
      </button>
    </div>
  );
};

export default Onboarding;
