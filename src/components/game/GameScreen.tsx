import { useEffect, useState, useCallback } from 'react';
import { Player } from './Player';
import { Bullet } from './Bullet';
import { Enemy } from './Enemy';
import { PowerUp } from './PowerUp';

interface GameObject {
  id: string;
  position: { x: number; y: number };
}

interface BulletObject extends GameObject {
  type: 'bullet';
}

interface EnemyObject extends GameObject {
  type: 'enemy';
  enemyType: 'normal' | 'boss';
  health: number;
}

interface PowerUpObject extends GameObject {
  type: 'powerup';
  powerType: 'weapon' | 'shield';
}

type GameObject = BulletObject | EnemyObject | PowerUpObject;

interface GameScreenProps {
  onGameOver: (score: number) => void;
}

export const GameScreen = ({ onGameOver }: GameScreenProps) => {
  const [playerPosition, setPlayerPosition] = useState({ x: window.innerWidth / 2, y: window.innerHeight - 100 });
  const [gameObjects, setGameObjects] = useState<GameObject[]>([]);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [playerHealth, setPlayerHealth] = useState(3);
  const [playerPowerUp, setPlayerPowerUp] = useState<'normal' | 'weapon' | 'shield'>('normal');
  const [powerUpTimer, setPowerUpTimer] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  
  const PLAYER_SIZE = 40;
  const BULLET_SIZE = 5;
  const ENEMY_SIZE = 30;
  const POWERUP_SIZE = 25;
  const PLAYER_SPEED = 5;
  const BULLET_SPEED = 10;
  const ENEMY_SPEED = 2;
  const POWERUP_SPEED = 3;
  
  // Handle shooting
  const handleShoot = useCallback(() => {
    const bulletId = `bullet-${Date.now()}-${Math.random()}`;
    
    if (playerPowerUp === 'weapon') {
      // Triple shot for weapon powerup
      setGameObjects(prev => [
        ...prev,
        { id: `${bulletId}-1`, type: 'bullet', position: { x: playerPosition.x - 10, y: playerPosition.y } },
        { id: `${bulletId}-2`, type: 'bullet', position: { x: playerPosition.x, y: playerPosition.y - 10 } },
        { id: `${bulletId}-3`, type: 'bullet', position: { x: playerPosition.x + 10, y: playerPosition.y } },
      ]);
    } else {
      // Normal shot
      setGameObjects(prev => [
        ...prev,
        { id: bulletId, type: 'bullet', position: { x: playerPosition.x, y: playerPosition.y } },
      ]);
    }
  }, [playerPosition, playerPowerUp]);
  
  // Spawn enemies
  useEffect(() => {
    if (isGameOver) return;
    
    const spawnInterval = setInterval(() => {
      // Spawn regular enemies
      if (Math.random() < 0.1 * level) {
        const enemyId = `enemy-${Date.now()}-${Math.random()}`;
        const x = Math.random() * (window.innerWidth - ENEMY_SIZE) + ENEMY_SIZE / 2;
        
        setGameObjects(prev => [
          ...prev,
          { 
            id: enemyId, 
            type: 'enemy', 
            enemyType: 'normal',
            health: 1,
            position: { x, y: 0 } 
          },
        ]);
      }
      
      // Spawn boss every 30 seconds
      if (level > 1 && Math.random() < 0.01) {
        const bossId = `boss-${Date.now()}-${Math.random()}`;
        const x = Math.random() * (window.innerWidth - ENEMY_SIZE * 2) + ENEMY_SIZE;
        
        setGameObjects(prev => [
          ...prev,
          { 
            id: bossId, 
            type: 'enemy', 
            enemyType: 'boss',
            health: 5,
            position: { x, y: 0 } 
          },
        ]);
      }
      
      // Spawn power-ups occasionally
      if (Math.random() < 0.02) {
        const powerUpId = `powerup-${Date.now()}-${Math.random()}`;
        const x = Math.random() * (window.innerWidth - POWERUP_SIZE) + POWERUP_SIZE / 2;
        const powerType = Math.random() < 0.5 ? 'weapon' : 'shield';
        
        setGameObjects(prev => [
          ...prev,
          { 
            id: powerUpId, 
            type: 'powerup', 
            powerType,
            position: { x, y: 0 } 
          },
        ]);
      }
    }, 1000);
    
    return () => clearInterval(spawnInterval);
  }, [level, isGameOver]);
  
  // Game loop
  useEffect(() => {
    if (isGameOver) return;
    
    const gameLoop = setInterval(() => {
      setGameObjects(prevObjects => {
        return prevObjects.map(obj => {
          if (obj.type === 'bullet') {
            // Move bullets up
            return {
              ...obj,
              position: {
                ...obj.position,
                y: obj.position.y - BULLET_SPEED
              }
            };
          } else if (obj.type === 'enemy') {
            // Move enemies down
            return {
              ...obj,
              position: {
                ...obj.position,
                y: obj.position.y + ENEMY_SPEED * (obj.enemyType === 'boss' ? 0.7 : 1)
              }
            };
          } else if (obj.type === 'powerup') {
            // Move power-ups down
            return {
              ...obj,
              position: {
                ...obj.position,
                y: obj.position.y + POWERUP_SPEED
              }
            };
          }
          return obj;
        });
      });
      
      // Decrease power-up timer
      if (powerUpTimer > 0) {
        setPowerUpTimer(prev => prev - 1);
      } else if (playerPowerUp !== 'normal') {
        setPlayerPowerUp('normal');
      }
      
      // Increase level over time
      if (score > level * 500) {
        setLevel(prev => prev + 1);
      }
    }, 16); // ~60fps
    
    return () => clearInterval(gameLoop);
  }, [isGameOver, powerUpTimer, playerPowerUp, score, level]);
  
  // Collision detection
  useEffect(() => {
    if (isGameOver) return;
    
    // Check for collisions and remove objects that are off-screen
    setGameObjects(prevObjects => {
      const bullets = prevObjects.filter(obj => obj.type === 'bullet');
      const enemies = prevObjects.filter(obj => obj.type === 'enemy');
      const powerUps = prevObjects.filter(obj => obj.type === 'powerup');
      
      // Check bullet-enemy collisions
      let updatedEnemies = [...enemies];
      let scoreIncrease = 0;
      
      bullets.forEach(bullet => {
        updatedEnemies = updatedEnemies.map(enemy => {
          const dx = bullet.position.x - enemy.position.x;
          const dy = bullet.position.y - enemy.position.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const collisionDistance = (enemy.enemyType === 'boss' ? ENEMY_SIZE * 1.25 : ENEMY_SIZE / 2) + BULLET_SIZE / 2;
          
          if (distance < collisionDistance) {
            // Bullet hit enemy
            const newHealth = enemy.health - 1;
            
            if (newHealth <= 0) {
              // Enemy destroyed
              scoreIncrease += enemy.enemyType === 'boss' ? 100 : 10;
              return { ...enemy, health: 0 }; // Mark for removal
            }
            
            return { ...enemy, health: newHealth };
          }
          
          return enemy;
        });
      });
      
      // Update score
      if (scoreIncrease > 0) {
        setScore(prev => prev + scoreIncrease);
      }
      
      // Check player-enemy collisions
      let playerDamaged = false;
      
      enemies.forEach(enemy => {
        const dx = playerPosition.x - enemy.position.x;
        const dy = playerPosition.y - enemy.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const collisionDistance = (enemy.enemyType === 'boss' ? ENEMY_SIZE * 1.25 : ENEMY_SIZE / 2) + PLAYER_SIZE / 2;
        
        if (distance < collisionDistance && enemy.health > 0) {
          // Player hit by enemy
          if (playerPowerUp !== 'shield') {
            playerDamaged = true;
          }
          
          // Mark enemy for removal
          updatedEnemies = updatedEnemies.map(e => 
            e.id === enemy.id ? { ...e, health: 0 } : e
          );
        }
      });
      
      // Check player-powerup collisions
      let collectedPowerUps: string[] = [];
      
      powerUps.forEach(powerUp => {
        const dx = playerPosition.x - powerUp.position.x;
        const dy = playerPosition.y - powerUp.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const collisionDistance = POWERUP_SIZE / 2 + PLAYER_SIZE / 2;
        
        if (distance < collisionDistance) {
          // Player collected power-up
          setPlayerPowerUp(powerUp.powerType);
          setPowerUpTimer(300); // 5 seconds at 60fps
          collectedPowerUps.push(powerUp.id);
        }
      });
      
      // Handle player damage
      if (playerDamaged) {
        setPlayerHealth(prev => {
          const newHealth = prev - 1;
          if (newHealth <= 0) {
            setIsGameOver(true);
            onGameOver(score);
          }
          return newHealth;
        });
      }
      
      // Filter out objects that are off-screen or destroyed
      return prevObjects.filter(obj => {
        if (obj.type === 'bullet') {
          return obj.position.y > -BULLET_SIZE;
        } else if (obj.type === 'enemy') {
          const enemy = obj as EnemyObject;
          return obj.position.y < window.innerHeight + ENEMY_SIZE && enemy.health > 0;
        } else if (obj.type === 'powerup') {
          return obj.position.y < window.innerHeight + POWERUP_SIZE && !collectedPowerUps.includes(obj.id);
        }
        return true;
      });
    });
  }, [gameObjects, playerPosition, isGameOver, onGameOver, score, playerPowerUp]);
  
  return (
    <div className="relative w-full h-screen overflow-hidden bg-gray-900">
      {/* Stars background */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 100 }).map((_, i) => (
          <div 
            key={i}
            className="absolute bg-white rounded-full"
            style={{
              width: Math.random() * 2 + 1,
              height: Math.random() * 2 + 1,
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              opacity: Math.random() * 0.7 + 0.3,
            }}
          />
        ))}
      </div>
      
      {/* Game objects */}
      <Player 
        position={playerPosition} 
        setPosition={setPlayerPosition} 
        size={PLAYER_SIZE} 
        speed={PLAYER_SPEED}
        onShoot={handleShoot}
      />
      
      {gameObjects.map(obj => {
        if (obj.type === 'bullet') {
          return <Bullet key={obj.id} position={obj.position} size={BULLET_SIZE} />;
        } else if (obj.type === 'enemy') {
          return (
            <Enemy 
              key={obj.id} 
              position={obj.position} 
              size={ENEMY_SIZE} 
              type={obj.enemyType} 
            />
          );
        } else if (obj.type === 'powerup') {
          return (
            <PowerUp 
              key={obj.id} 
              position={obj.position} 
              size={POWERUP_SIZE} 
              type={obj.powerType} 
            />
          );
        }
        return null;
      })}
      
      {/* UI */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center">
        <div className="text-white font-bold">
          Score: {score}
        </div>
        <div className="text-white font-bold">
          Level: {level}
        </div>
        <div className="flex">
          {Array.from({ length: playerHealth }).map((_, i) => (
            <div key={i} className="w-6 h-6 mx-1">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#F43F5E" />
              </svg>
            </div>
          ))}
        </div>
      </div>
      
      {/* Power-up indicator */}
      {playerPowerUp !== 'normal' && (
        <div className="absolute bottom-4 left-4 flex items-center">
          <div className={`w-8 h-8 rounded-full ${playerPowerUp === 'weapon' ? 'bg-green-500' : 'bg-blue-500'}`}>
            {playerPowerUp === 'weapon' ? (
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="p-1">
                <path d="M7 17L17 7M7 7L17 17" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="p-1">
                <circle cx="12" cy="12" r="8" stroke="white" strokeWidth="2" fill="none" />
              </svg>
            )}
          </div>
          <div className="ml-2 bg-gray-800 bg-opacity-70 px-2 py-1 rounded text-white">
            {Math.ceil(powerUpTimer / 60)}s
          </div>
        </div>
      )}
    </div>
  );
};