import { useState } from 'react';
import { useStore } from '../../store/useStore';
import './Dice.css'; // Import the CSS file for styles

const Dice = () => {
  const { diceValue, rollDice } = useStore();
  const [rolling, setRolling] = useState(false);
  const [displayValue, setDisplayValue] = useState(diceValue);

  const handleRoll = () => {
    if (!rolling) {  // Prevent rolling while animation is in progress
      setRolling(true);
      setDisplayValue(0);

      const rollDuration = Math.floor(Math.random() * 2000) + 1000;
      const interval = setInterval(() => {
        setDisplayValue(Math.floor(Math.random() * 6) + 1);
      }, 100);

      setTimeout(() => {
        clearInterval(interval);
        const finalValue = rollDice();
        setDisplayValue(finalValue);
        setRolling(false);
        
        // Move player after dice roll animation
        useStore.getState().movePlayer();
      }, rollDuration);
    }
  };

  return (
    <div 
      onClick={handleRoll} 
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        cursor: 'pointer',
        fontSize: '2rem',
        backgroundColor: 'white',
        padding: '10px',
        borderRadius: '5px',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)',
        zIndex: 1000,
      }}
    >
      <div className={rolling ? 'dice-rolling' : ''}>
        🎲 {rolling ? displayValue : diceValue}
      </div>
    </div>
  );
};

export default Dice;
