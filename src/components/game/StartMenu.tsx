interface StartMenuProps {
  onStart: () => void;
  highScore: number;
}

export const StartMenu = ({ onStart, highScore }: StartMenuProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h1 className="text-6xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-pink-500">
        SPACE SHOOTER
      </h1>
      
      <div className="mb-12 text-center">
        <p className="text-xl mb-2">Arrow keys or WASD to move</p>
        <p className="text-xl">Space bar to shoot</p>
      </div>
      
      {highScore > 0 && (
        <div className="mb-8 text-2xl">
          High Score: <span className="font-bold text-yellow-300">{highScore}</span>
        </div>
      )}
      
      <button
        onClick={onStart}
        className="px-8 py-4 text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all"
      >
        START GAME
      </button>
    </div>
  );
};