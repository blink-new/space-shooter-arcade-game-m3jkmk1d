interface EnemyProps {
  position: { x: number; y: number };
  size: number;
  type: 'normal' | 'boss';
}

export const Enemy = ({ position, size, type }: EnemyProps) => {
  const isBoss = type === 'boss';
  const bossScale = 2.5;
  const actualSize = isBoss ? size * bossScale : size;
  
  return (
    <div
      className="absolute"
      style={{
        left: position.x,
        top: position.y,
        width: actualSize,
        height: actualSize,
        transform: 'translate(-50%, -50%)',
      }}
    >
      {isBoss ? (
        <svg width={actualSize} height={actualSize} viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M30 10L45 25L50 15L45 5L30 10Z" fill="#F43F5E" />
          <path d="M30 10L15 25L10 15L15 5L30 10Z" fill="#F43F5E" />
          <path d="M30 50L45 35L50 45L45 55L30 50Z" fill="#F43F5E" />
          <path d="M30 50L15 35L10 45L15 55L30 50Z" fill="#F43F5E" />
          <circle cx="30" cy="30" r="15" fill="#FB7185" />
          <circle cx="25" cy="25" r="3" fill="#FFF" />
          <circle cx="35" cy="25" r="3" fill="#FFF" />
          <path d="M25 40C25 40 30 45 35 40" stroke="#FFF" strokeWidth="2" />
        </svg>
      ) : (
        <svg width={actualSize} height={actualSize} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 5L10 20L20 35L30 20L20 5Z" fill="#FB7185" />
          <circle cx="20" cy="20" r="5" fill="#F43F5E" />
          <circle cx="17" cy="17" r="2" fill="#FFF" />
          <circle cx="23" cy="17" r="2" fill="#FFF" />
        </svg>
      )}
    </div>
  );
};