interface GameOverProps {
  score: number;
  highScore: number;
  onRestart: () => void;
  onMainMenu: () => void;
}

export const GameOver = ({ score, highScore, onRestart, onMainMenu }: GameOverProps) => {
  const isNewHighScore = score > highScore;
  
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h1 className="text-5xl font-bold mb-8 text-red-500">GAME OVER</h1>
      
      <div className="mb-8 text-center">
        <p className="text-2xl mb-2">Your Score: <span className="font-bold text-yellow-300">{score}</span></p>
        <p className="text-xl">High Score: <span className="font-bold text-yellow-300">{Math.max(score, highScore)}</span></p>
        
        {isNewHighScore && (
          <div className="mt-4 text-2xl font-bold text-green-400 animate-pulse">
            NEW HIGH SCORE!
          </div>
        )}
      </div>
      
      <div className="flex space-x-4">
        <button
          onClick={onRestart}
          className="px-6 py-3 text-xl font-bold bg-blue-600 rounded-lg hover:bg-blue-700 transform hover:scale-105 transition-all"
        >
          PLAY AGAIN
        </button>
        
        <button
          onClick={onMainMenu}
          className="px-6 py-3 text-xl font-bold bg-purple-600 rounded-lg hover:bg-purple-700 transform hover:scale-105 transition-all"
        >
          MAIN MENU
        </button>
      </div>
    </div>
  );
};