import React, { useState, useEffect, useCallback } from 'react';
import { Play } from 'lucide-react';
import Player from './components/Player';
import Obstacle from './components/Obstacle';
import Ground from './components/Ground';

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [playerY, setPlayerY] = useState(0);
  const [obstacles, setObstacles] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [difficulty, setDifficulty] = useState(1);

  const jump = useCallback(() => {
    if (playerY === 0) {
      setPlayerY(100);
      setTimeout(() => setPlayerY(0), 500);
    }
  }, [playerY]);

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setObstacles([]);
    setGameOver(false);
    setDifficulty(1);
  };

  useEffect(() => {
    const storedHighScore = localStorage.getItem('highScore');
    if (storedHighScore) {
      setHighScore(parseInt(storedHighScore, 10));
    }
  }, []);

  useEffect(() => {
    if (gameStarted && !gameOver) {
      const interval = setInterval(() => {
        setScore((prevScore) => {
          const newScore = prevScore + 1;
          if (newScore > highScore) {
            setHighScore(newScore);
            localStorage.setItem('highScore', newScore.toString());
          }
          return newScore;
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [gameStarted, gameOver, highScore]);

  useEffect(() => {
    if (gameStarted && !gameOver) {
      const obstacleInterval = setInterval(() => {
        setObstacles((prevObstacles) => [
          ...prevObstacles,
          {
            id: Date.now(),
            x: 400,
            type: Math.random() < 0.3 ? 'flying' : 'ground',
          },
        ]);
      }, 2000 / difficulty);

      const gameLoop = setInterval(() => {
        setObstacles((prevObstacles) =>
          prevObstacles
            .map((obstacle) => ({ ...obstacle, x: obstacle.x - (5 * difficulty) }))
            .filter((obstacle) => obstacle.x > -50)
        );

        // 碰撞检测
        setObstacles((prevObstacles) => {
          let collision = false;
          const updatedObstacles = prevObstacles.filter((obstacle) => {
            if (
              obstacle.x < 50 &&
              obstacle.x > 0 &&
              ((obstacle.type === 'ground' && playerY < 50) ||
               (obstacle.type === 'flying' && playerY > 50))
            ) {
              collision = true;
            }
            return obstacle.x > -50;
          });

          if (collision) {
            setGameOver(true);
          }

          return updatedObstacles;
        });

        // 增加难度
        setDifficulty((prevDifficulty) => Math.min(prevDifficulty + 0.001, 2));
      }, 20);

      return () => {
        clearInterval(obstacleInterval);
        clearInterval(gameLoop);
      };
    }
  }, [gameStarted, gameOver, difficulty, playerY]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === 'Space') {
        if (!gameStarted) {
          startGame();
        } else {
          jump();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameStarted, jump]);

  return (
    <div className="min-h-screen bg-blue-100 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">跑酷游戏</h1>
      <div className="relative w-[400px] h-[200px] bg-white border-2 border-black overflow-hidden">
        {!gameStarted ? (
          <button
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-500 text-white px-4 py-2 rounded flex items-center"
            onClick={startGame}
          >
            <Play className="mr-2" /> 开始游戏
          </button>
        ) : (
          <>
            <Player y={playerY} />
            {obstacles.map((obstacle) => (
              <Obstacle key={obstacle.id} x={obstacle.x} type={obstacle.type} />
            ))}
            <Ground />
          </>
        )}
        {gameOver && (
          <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-white text-center">
              <h2 className="text-2xl font-bold mb-2">游戏结束</h2>
              <p className="mb-2">得分: {score}</p>
              <p className="mb-4">最高分: {highScore}</p>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded"
                onClick={startGame}
              >
                重新开始
              </button>
            </div>
          </div>
        )}
      </div>
      {gameStarted && !gameOver && (
        <div className="mt-4 text-xl font-bold">得分: {score}</div>
      )}
      <p className="mt-2 text-lg font-semibold">最高分: {highScore}</p>
      <p className="mt-4 text-sm text-gray-600">
        按空格键开始游戏和跳跃
      </p>
    </div>
  );
}

export default App;