interface PowerUpProps {
  position: { x: number; y: number };
  size: number;
  type: 'weapon' | 'shield';
}

export const PowerUp = ({ position, size, type }: PowerUpProps) => {
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
      {type === 'weapon' ? (
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="20" cy="20" r="15" fill="#34D399" />
          <path d="M15 15L25 25M15 25L25 15" stroke="#FFF" strokeWidth="3" />
        </svg>
      ) : (
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="20" cy="20" r="15" fill="#818CF8" />
          <circle cx="20" cy="20" r="10" stroke="#FFF" strokeWidth="3" fill="none" />
        </svg>
      )}
    </div>
  );
};