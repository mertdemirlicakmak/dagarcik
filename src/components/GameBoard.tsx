import React from 'react';
import { Guess } from './WordleGame';
import '../styles/GameBoard.css';

interface GameBoardProps {
  rows: Guess[];
}

const GameBoard: React.FC<GameBoardProps> = ({ rows }) => {
  return (
    <div className="game-board">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="row">
          {Array.from({ length: 5 }).map((_, letterIndex) => {
            const letter = row.word[letterIndex] || '';
            return (
              <div 
                key={letterIndex} 
                className={`cell ${row.statuses[letterIndex]}`}
              >
                {letter}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default GameBoard; 