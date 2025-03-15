interface BulletProps {
  position: { x: number; y: number };
  size: number;
}

export const Bullet = ({ position, size }: BulletProps) => {
  return (
    <div
      className="absolute bg-yellow-300 rounded-full"
      style={{
        left: position.x,
        top: position.y,
        width: size,
        height: size * 2,
        transform: 'translate(-50%, -50%)',
      }}
    />
  );
};