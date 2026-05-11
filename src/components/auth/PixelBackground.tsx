import React, { useMemo } from 'react';

interface PixelBackgroundProps {
  count?: number;
}

const PixelBackground: React.FC<PixelBackgroundProps> = ({ count = 60 }) => {
  const particles = useMemo(() => {
    return [...Array(count)].map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 15}s`,
      duration: `${8 + Math.random() * 12}s`,
      isHollow: i % 3 === 0,
      isLarge: i % 5 === 0,
      speedClass: i % 4 === 0 ? 'slow' : i % 7 === 0 ? 'fast' : '',
    }));
  }, [count]);

  return (
    <div className="pixel-rain">
      {particles.map((p) => (
        <div
          key={p.id}
          className={`pixel-particle ${p.isHollow ? 'hollow' : ''} ${p.isLarge ? 'large' : ''} ${p.speedClass}`}
          style={{
            left: p.left,
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
        />
      ))}
    </div>
  );
};

export default React.memo(PixelBackground);
