import React, { useState } from 'react';
import TokenOne from '../../components/playertokens/TokenOne';
import TokenTwo from '../../components/playertokens/TokenTwo';

const Onboarding = () => {
  const [mode, setMode] = useState<'local' | 'online' | null>(null);
  const [numPlayers, setNumPlayers] = useState<number>(2);
  const [playerNames, setPlayerNames] = useState<string[]>(['', '', '', '']);
  const [playerTokens, setPlayerTokens] = useState<string[]>(['TokenOne', 'TokenOne', 'TokenOne', 'TokenOne']); // Default to TokenOne

  const handleStartLocalGame = () => {
    console.log('Starting local game with:', playerNames, playerTokens);
  };

  return (
    <div className="onboarding">
      <h1>Welcome to the Game!</h1>
      {!mode ? (
        <div>
          <h2>Select Game Mode</h2>
          <button onClick={() => setMode('local')}>Local Multiplayer</button>
          <button onClick={() => setMode('online')}>Online Multiplayer</button>
        </div>
      ) : mode === 'local' ? (
        <div>
          <h2>Select Number of Players</h2>
          <select value={numPlayers} onChange={(e) => setNumPlayers(Number(e.target.value))}>
            <option value={2}>2 Players</option>
            <option value={3}>3 Players</option>
            <option value={4}>4 Players</option>
          </select>

          <h2>Enter Player Names</h2>
          {Array.from({ length: numPlayers }).map((_, index) => (
            <div key={index}>
              <input
                type="text"
                placeholder={`Player ${index + 1} Name`}
                value={playerNames[index]}
                onChange={(e) => {
                  const newNames = [...playerNames];
                  newNames[index] = e.target.value;
                  setPlayerNames(newNames);
                }}
              />
              <h3>Select Token</h3>
              <div>
                <button onClick={() => {
                  const newTokens = [...playerTokens];
                  newTokens[index] = 'TokenOne';
                  setPlayerTokens(newTokens);
                }}>
                  <TokenOne position={[0, 0, 0]} />
                </button>
                <button onClick={() => {
                  const newTokens = [...playerTokens];
                  newTokens[index] = 'TokenTwo';
                  setPlayerTokens(newTokens);
                }}>
                  <TokenTwo position={[0, 0, 0]} />
                </button>
              </div>
            </div>
          ))}

          <button onClick={handleStartLocalGame}>Start Game</button>
        </div>
      ) : (
        <div>
          <h2>Join or Create a Room</h2>
          {/* Room code input and logic can be added here */}
        </div>
      )}
    </div>
  );
};

export default Onboarding;
