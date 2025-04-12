import React, { useState, useEffect, useCallback } from 'react';
import GameBoard from './GameBoard';
import Keyboard from './Keyboard';
import { getWordOfTheDay, isValidWord, getTodayDateString } from '../utils/wordUtils';
import '../styles/WordleGame.css';

// Define the status for each letter in a guess
export type LetterStatus = 'correct' | 'present' | 'absent' | 'unused';

// Define the structure of a single guess
export interface Guess {
  word: string;
  statuses: LetterStatus[];
}

const WORD_LENGTH = 5;
const MAX_ATTEMPTS = 6;
const STORAGE_KEY = 'wordleGameState';

const WordleGame: React.FC = () => {
  // Today's word using our utility
  const [targetWord, setTargetWord] = useState<string>(getWordOfTheDay());
  const [currentGuess, setCurrentGuess] = useState<string>("");
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [keyboardStatus, setKeyboardStatus] = useState<Record<string, LetterStatus>>({});
  const [error, setError] = useState<string | null>(null);

  // Load game state from localStorage on initial render
  useEffect(() => {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      const { guesses, gameStatus, keyboardStatus, date } = JSON.parse(savedState);
      
      // Check if the saved state is from today
      const today = new Date().toDateString();
      if (date === today) {
        setGuesses(guesses);
        setGameStatus(gameStatus);
        setKeyboardStatus(keyboardStatus);
      }
    }
  }, []);

  // Save game state to localStorage whenever it changes
  useEffect(() => {
    if (guesses.length > 0 || gameStatus !== 'playing') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        guesses,
        gameStatus,
        keyboardStatus,
        date: new Date().toDateString()
      }));
    }
  }, [guesses, gameStatus, keyboardStatus]);

  // Define submitGuess with useCallback to avoid dependency issues
  const submitGuess = useCallback(() => {
    if (currentGuess.length !== WORD_LENGTH) {
      setError("Word must be 5 letters");
      return;
    }

    // Create array to track letter statuses
    const newStatuses: LetterStatus[] = Array(WORD_LENGTH).fill('absent');
    const targetLetters = targetWord.split(''); // Create a copy of target word as array
    const guessLetters = currentGuess.split('');
    
    // First pass: find correct positions (green)
    for (let i = 0; i < WORD_LENGTH; i++) {
      if (guessLetters[i] === targetLetters[i]) {
        newStatuses[i] = 'correct';
        targetLetters[i] = '*'; // Mark as used
        guessLetters[i] = '-'; // Mark as processed
      }
    }
    
    // Second pass: find misplaced letters (yellow)
    for (let i = 0; i < WORD_LENGTH; i++) {
      if (guessLetters[i] !== '-') { // Skip already processed letters
        const targetIndex = targetLetters.indexOf(guessLetters[i]);
        if (targetIndex !== -1) {
          newStatuses[i] = 'present';
          targetLetters[targetIndex] = '*'; // Mark as used
        }
      }
    }

    // Update keyboard statuses
    const newKeyboardStatus = { ...keyboardStatus };
    for (let i = 0; i < WORD_LENGTH; i++) {
      const letter = currentGuess[i];
      const currentStatus = newKeyboardStatus[letter] || 'unused';
      const newStatus = newStatuses[i];
      
      // Only upgrade status (unused -> absent -> present -> correct)
      if (
        currentStatus === 'unused' || 
        (currentStatus === 'absent' && (newStatus === 'present' || newStatus === 'correct')) ||
        (currentStatus === 'present' && newStatus === 'correct')
      ) {
        newKeyboardStatus[letter] = newStatus;
      }
    }
    setKeyboardStatus(newKeyboardStatus);

    // Add the new guess
    const newGuess: Guess = {
      word: currentGuess,
      statuses: newStatuses
    };
    
    const updatedGuesses = [...guesses, newGuess];
    setGuesses(updatedGuesses);
    setCurrentGuess('');
    setError(null);

    // Check for win or loss
    if (currentGuess === targetWord) {
      setGameStatus('won');
    } else if (updatedGuesses.length >= MAX_ATTEMPTS) {
      setGameStatus('lost');
    }
  }, [currentGuess, targetWord, keyboardStatus, guesses, WORD_LENGTH, MAX_ATTEMPTS]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameStatus !== 'playing') return;

      if (e.key === 'Enter') {
        submitGuess();
      } else if (e.key === 'Backspace') {
        setCurrentGuess(prev => prev.slice(0, -1));
        setError(null);
      } else if (/^[A-Za-z]$/.test(e.key) && currentGuess.length < WORD_LENGTH) {
        setCurrentGuess(prev => (prev + e.key).toUpperCase().slice(0, WORD_LENGTH));
        setError(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentGuess, gameStatus, submitGuess, WORD_LENGTH]);

  // Function to handle key press from on-screen keyboard
  const handleKeyPress = (key: string) => {
    if (gameStatus !== 'playing') return;

    if (key === 'ENTER') {
      submitGuess();
    } else if (key === '⌫') {
      setCurrentGuess(prev => prev.slice(0, -1));
      setError(null);
    } else if (currentGuess.length < WORD_LENGTH) {
      setCurrentGuess(prev => (prev + key).slice(0, WORD_LENGTH));
      setError(null);
    }
  };

  // Create empty rows to fill up to MAX_ATTEMPTS
  const emptyRows = Array(MAX_ATTEMPTS - guesses.length - (currentGuess ? 1 : 0))
    .fill(null)
    .map(() => ({
      word: '',
      statuses: Array(WORD_LENGTH).fill('unused')
    }));

  // Create a current guess row if there is a current guess
  const currentGuessRow = currentGuess
    ? {
        word: currentGuess.padEnd(WORD_LENGTH, ' '),
        statuses: Array(WORD_LENGTH).fill('unused')
      }
    : null;

  // Combine all rows for rendering
  const allRows = [
    ...guesses,
    ...(currentGuessRow ? [currentGuessRow] : []),
    ...emptyRows
  ].slice(0, MAX_ATTEMPTS);

  return (
    <div className="wordle-game">
      <h1>dağarcık</h1>
      <div className="date-display">{getTodayDateString()}</div>
      
      {gameStatus === 'won' && (
        <div className="game-message success">
          Congratulations! You guessed the word!
        </div>
      )}
      
      {gameStatus === 'lost' && (
        <div className="game-message failure">
          Game Over! The word was {targetWord}.
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      <GameBoard rows={allRows} />
      
      <Keyboard 
        onKeyPress={handleKeyPress} 
        letterStatus={keyboardStatus}
      />
    </div>
  );
};

export default WordleGame; 