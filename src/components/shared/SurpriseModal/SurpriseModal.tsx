import { useState, useEffect } from 'react';
import './SurpriseModal.css';
import { benefits } from '../../../contants/surprises/benefits';
import { blessings } from '../../../contants/surprises/blessing';
import { traps } from '../../../contants/surprises/traps';

interface SurpriseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEffectComplete: (effect: string) => void;
}

const SurpriseModal = ({ isOpen, onClose, onEffectComplete }: SurpriseModalProps) => {
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [surprise, setSurprise] = useState<any>(null);

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
      // Wait 3 seconds before executing effect
      setTimeout(() => {
        onEffectComplete(selectedSurprise.effect);
        onClose();
        // Reset state for next time
        setSelectedCard(null);
        setRevealed(false);
        setSurprise(null);
      }, 3000);
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="surprise-modal-overlay">
      <div className="surprise-modal">
        <h2>Choose Your Destiny!</h2>
        <div className="cards-container">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className={`mystery-card ${selectedCard === index ? 'scratched' : ''} ${
                selectedCard === index && revealed ? 'revealed' : ''
              }`}
              onClick={() => revealCard(index)}
            >
              {selectedCard === index && revealed ? (
                <div className={`surprise-content ${surprise?.type}`}>
                  <h3>{surprise?.name}</h3>
                  <p>{surprise?.description}</p>
                </div>
              ) : (
                <div className="card-back">?</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SurpriseModal;
