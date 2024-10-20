import React from 'react';

interface ObstacleProps {
  x: number;
  type: 'ground' | 'flying';
}

const Obstacle: React.FC<ObstacleProps> = ({ x, type }) => {
  const obstacleStyle = type === 'flying' 
    ? 'bottom-20 bg-yellow-500' 
    : 'bottom-0 bg-green-500';

  return (
    <div
      className={`absolute w-8 h-16 ${obstacleStyle}`}
      style={{ left: `${x}px` }}
    ></div>
  );
};

export default Obstacle;