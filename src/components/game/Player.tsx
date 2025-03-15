import { useEffect, useRef } from 'react';

interface PlayerProps {
  position: { x: number; y: number };
  setPosition: (position: { x: number; y: number }) => void;
  size: number;
  speed: number;
  onShoot: () => void;
}

export const Player = ({ position, setPosition, size, speed, onShoot }: PlayerProps) => {
  const keysPressed = useRef<Set<string>>(new Set());
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current.add(e.key);
      
      // Shoot on space bar
      if (e.key === ' ') {
        onShoot();
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.key);
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    const moveInterval = setInterval(() => {
      let newX = position.x;
      let newY = position.y;
      
      if (keysPressed.current.has('ArrowLeft') || keysPressed.current.has('a')) {
        newX = Math.max(0, newX - speed);
      }
      if (keysPressed.current.has('ArrowRight') || keysPressed.current.has('d')) {
        newX = Math.min(window.innerWidth - size, newX + speed);
      }
      if (keysPressed.current.has('ArrowUp') || keysPressed.current.has('w')) {
        newY = Math.max(0, newY - speed);
      }
      if (keysPressed.current.has('ArrowDown') || keysPressed.current.has('s')) {
        newY = Math.min(window.innerHeight - size, newY + speed);
      }
      
      if (newX !== position.x || newY !== position.y) {
        setPosition({ x: newX, y: newY });
      }
    }, 16); // ~60fps
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      clearInterval(moveInterval);
    };
  }, [position, setPosition, size, speed, onShoot]);
  
  return (
    <div 
      className="absolute"
      style={{
        left: position.x,
        top: position.y,
        width: size,
        height: size,
        transform: 'translate(-50%, -50%)',
      }}
    >
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 0L25 30L20 25L15 30L20 0Z" fill="#38BDF8" />
        <path d="M15 30L5 35L20 25L15 30Z" fill="#0EA5E9" />
        <path d="M25 30L35 35L20 25L25 30Z" fill="#0EA5E9" />
        <circle cx="20" cy="20" r="5" fill="#F472B6" />
      </svg>
    </div>
  );
};