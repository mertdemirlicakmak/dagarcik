import React from 'react';
import { LetterStatus } from './WordleGame';
import '../styles/Keyboard.css';

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  letterStatus: Record<string, LetterStatus>;
}

const Keyboard: React.FC<KeyboardProps> = ({ onKeyPress, letterStatus }) => {
  const keyboardRows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫']
  ];

  return (
    <div className="keyboard">
      {keyboardRows.map((row, rowIndex) => (
        <div key={rowIndex} className="keyboard-row">
          {row.map((key) => {
            const status = letterStatus[key] || 'unused';
            const isWideKey = key === 'ENTER' || key === '⌫';
            
            return (
              <button
                key={key}
                className={`keyboard-key ${status} ${isWideKey ? 'wide-key' : ''}`}
                onClick={() => onKeyPress(key)}
              >
                {key}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Keyboard; 