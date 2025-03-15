import { useState, useEffect } from 'react';
import { StartMenu } from './components/game/StartMenu';
import { GameScreen } from './components/game/GameScreen';
import { GameOver } from './components/game/GameOver';

type GameState = 'menu' | 'playing' | 'gameOver';

function App() {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  
  // Load high score from localStorage
  useEffect(() => {
    const savedHighScore = localStorage.getItem('spaceShooterHighScore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore, 10));
    }
  }, []);
  
  // Save high score to localStorage
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('spaceShooterHighScore', score.toString());
    }
  }, [score, highScore]);
  
  const handleStartGame = () => {
    setScore(0);
    setGameState('playing');
  };
  
  const handleGameOver = (finalScore: number) => {
    setScore(finalScore);
    setGameState('gameOver');
  };
  
  const handleRestart = () => {
    setScore(0);
    setGameState('playing');
  };
  
  const handleMainMenu = () => {
    setGameState('menu');
  };
  
  return (
    <div className="w-full h-screen overflow-hidden">
      {gameState === 'menu' && (
        <StartMenu onStart={handleStartGame} highScore={highScore} />
      )}
      
      {gameState === 'playing' && (
        <GameScreen onGameOver={handleGameOver} />
      )}
      
      {gameState === 'gameOver' && (
        <GameOver 
          score={score} 
          highScore={highScore} 
          onRestart={handleRestart} 
          onMainMenu={handleMainMenu} 
        />
      )}
    </div>
  );
}

export default App;