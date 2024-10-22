import React, { useRef, useEffect, useState } from 'react';

const Game = () => {
  const canvasRef = useRef(null);
  const shipX = useRef(400);
  const shipY = 500;
  const bgY = useRef(0);
  const [meteors, setMeteors] = useState([]);
  const [bullets, setBullets] = useState([]);
  const [score, setScore] = useState(0);
  const meteorSpeed = 2;
  const bulletSpeed = 5;
  const FPS = 60;

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // Background and spaceship images
    const bgImage = new Image();
    const shipImage = new Image();

    bgImage.src = 'https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/3eca82e9-3900-487c-be58-f5bb4d614fc6/original=true,quality=90/F8F735DF7AA70769647FB8132ED6A4D902E834504451CA39BC4C1F52F9E295A6.jpeg';
    shipImage.src = 'https://e7.pngegg.com/pngimages/329/505/png-clipart-grey-and-red-fighting-jet-illustration-spacecraft-spaceship-file-miscellaneous-airplane.png';

    let gameInterval;
    let meteorInterval;

    // Game logic
    const createMeteor = () => {
      const size = Math.random() * 30 + 20;
      const x = Math.random() * canvas.width;
      const y = -size;
      setMeteors(prevMeteors => [...prevMeteors, { x, y, size }]);
    };

    const updateMeteors = () => {
      setMeteors(prevMeteors =>
        prevMeteors
          .filter(meteor => meteor.y < canvas.height)
          .map(meteor => ({ ...meteor, y: meteor.y + meteorSpeed }))
      );
    };

    const createBullet = () => {
      setBullets(prevBullets => [
        ...prevBullets,
        { x: shipX.current, y: shipY }
      ]);
    };

    const updateBullets = () => {
      setBullets(prevBullets =>
        prevBullets
          .filter(bullet => bullet.y > 0)
          .map(bullet => ({ ...bullet, y: bullet.y - bulletSpeed }))
      );
    };

    const checkCollisions = () => {
      setMeteors(prevMeteors =>
        prevMeteors.filter(meteor => {
          let isHit = false;
          setBullets(prevBullets =>
            prevBullets.filter(bullet => {
              if (
                bullet.x > meteor.x &&
                bullet.x < meteor.x + meteor.size &&
                bullet.y > meteor.y &&
                bullet.y < meteor.y + meteor.size
              ) {
                isHit = true;
                setScore(prevScore => prevScore + 1);
                return false;
              }
              return true;
            })
          );
          return !isHit;
        })
      );
    };

    const drawBackground = () => {
      context.drawImage(bgImage, 0, bgY.current, canvas.width, canvas.height);
      context.drawImage(
        bgImage,
        0,
        bgY.current - canvas.height,
        canvas.width,
        canvas.height
      );
      bgY.current += 1;
      if (bgY.current >= canvas.height) bgY.current = 0;
    };

    const drawShip = () => {
      context.drawImage(shipImage, shipX.current - 20, shipY, 40, 40);
    };

    const drawMeteors = () => {
      meteors.forEach(meteor => {
        context.beginPath();
        context.arc(meteor.x, meteor.y, meteor.size, 0, Math.PI * 2);
        context.fillStyle = 'gray';
        context.fill();
        context.closePath();
      });
    };

    const drawBullets = () => {
      bullets.forEach(bullet => {
        context.beginPath();
        context.rect(bullet.x - 2, bullet.y - 10, 4, 10);
        context.fillStyle = 'yellow';
        context.fill();
        context.closePath();
      });
    };

    const gameLoop = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      drawBackground();
      drawShip();
      drawMeteors();
      drawBullets();
      checkCollisions();
      updateMeteors();
      updateBullets();
    };

    const startGame = () => {
      gameInterval = setInterval(gameLoop, 1000 / FPS);
      meteorInterval = setInterval(createMeteor, 2000);
    };

    const stopGame = () => {
      clearInterval(gameInterval);
      clearInterval(meteorInterval);
    };

    bgImage.onload = () => {
      shipImage.onload = startGame;
    };

    return () => {
      stopGame();
    };
  }, [meteors, bullets]);

  const handleMouseClick = () => {
    createBullet();
  };

  const handleMouseMove = event => {
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    shipX.current = mouseX;
  };

  return (
    <>
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        style={{ border: '1px solid #000', display: 'block', margin: '0 auto' }}
        onMouseMove={handleMouseMove}
        onClick={handleMouseClick}
      />
      <div style={{ textAlign: 'center', marginTop: '10px' }}>Score: {score}</div>
    </>
  );
};

export default Game;
