import { useState } from 'react';
import './SurpriseModal.css';
import { benefits } from '../../../contants/surprises/benefits';
import { blessings } from '../../../contants/surprises/blessing';
import { traps } from '../../../contants/surprises/traps';
import { usePlayerStore } from '../../../store/usePlayerStore';
import mapData from '../../../contants/maps/grassland.json';

interface SurpriseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEffectComplete: (effect: string) => void;
}

// Define movement effects
const MOVEMENT_EFFECTS = [
  'MOVE_FORWARD_4',
  'MOVE_BACK_3',
  // Add other movement effects here
];

const SurpriseModal = ({ isOpen, onClose, onEffectComplete }: SurpriseModalProps) => {
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [surprise, setSurprise] = useState<any>(null);
  const [showCompleteButton, setShowCompleteButton] = useState(false);

  const checkForSurpriseTile = () => {
    const activePlayer = usePlayerStore.getState().getActivePlayer();
    if (!activePlayer) return false;
    
    const currentTile = mapData.tiles.find(t => t.id === activePlayer.currentTile);
    return currentTile?.special === 'surprise';
  };

  const handleTaskComplete = () => {
    usePlayerStore.getState().nextTurn();
    onClose();
    setSelectedCard(null);
    setRevealed(false);
    setSurprise(null);
    setShowCompleteButton(false);
  };

  const revealCard = (cardIndex: number) => {
    if (selectedCard !== null) return;
    setSelectedCard(cardIndex);

    // Randomly decide if it's trap/blessing/benefit
    const type = Math.random();
    let selectedSurprise;

    if (type < 0.33) {
      selectedSurprise = {
        type: 'trap',
        ...traps[Math.floor(Math.random() * traps.length)]
      };
    } else if (type < 0.66) {
      selectedSurprise = {
        type: 'blessing',
        ...blessings[Math.floor(Math.random() * blessings.length)]
      };
    } else {
      selectedSurprise = {
        type: 'benefit',
        ...benefits[Math.floor(Math.random() * benefits.length)]
      };
    }

    setSurprise(selectedSurprise);
    
    // Reveal after scratch animation
    setTimeout(() => {
      setRevealed(true);
      
      // Check if it's a movement effect
      const isMovementEffect = MOVEMENT_EFFECTS.includes(selectedSurprise.effect);
      
      if (isMovementEffect) {
        // For movement effects, execute immediately
        setTimeout(() => {
          onEffectComplete(selectedSurprise.effect);
          onClose();
          setSelectedCard(null);
          setRevealed(false);
          setSurprise(null);
        }, 3000);
      } else {
        // For non-movement effects, show complete button
        setShowCompleteButton(true);
      }
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Surprise Tile!</h2>
        {!revealed ? (
          <div className="card-selection">
            <p>Pick a card to reveal your surprise!</p>
            <div className="cards">
              {[0, 1, 2].map((index) => (
                <div
                  key={index}
                  className={`card ${selectedCard === index ? 'selected' : ''}`}
                  onClick={() => revealCard(index)}
                >
                  ?
                </div>
              ))}
            </div>
          </div>
        ) : surprise && (
          <div className="surprise-reveal">
            <h3>{surprise.name}</h3>
            <p>{surprise.description}</p>
            {showCompleteButton && (
              <button 
                className="complete-button"
                onClick={handleTaskComplete}
              >
                Task Complete
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SurpriseModal;
