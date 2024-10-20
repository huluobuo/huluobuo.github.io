import React from 'react';

interface PlayerProps {
  y: number;
}

const Player: React.FC<PlayerProps> = ({ y }) => {
  return (
    <div
      className="absolute left-10 w-10 h-10 bg-red-500"
      style={{ bottom: `${y}px` }}
    ></div>
  );
};

export default Player;