import React, { useRef, useEffect, useState } from 'react';

const Game = () => {
  const canvasRef = useRef(null);
  const shipX = useRef(400);
  const shipY = 500;
  const [meteors, setMeteors] = useState([]);
  const [bullets, setBullets] = useState([]);
  const [score, setScore] = useState(0);
  const meteorSpeed = 3;
  const bulletSpeed = 5;
  const FPS = 60;
  const gameLoopRef = useRef(null);
  const [bgY, setBgY] = useState(0);  // State to track background's vertical position
  const bgSpeed = 2;  // Speed of background scrolling

  // Function to create a new bullet
  const createBullet = () => {
    setBullets(prevBullets => [
      ...prevBullets,
      { x: shipX.current, y: shipY }
    ]);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // Load background and spaceship images
    const bgImage = new Image();
    const shipImage = new Image();

    bgImage.src = 'https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/3eca82e9-3900-487c-be58-f5bb4d614fc6/original=true,quality=90/F8F735DF7AA70769647FB8132ED6A4D902E834504451CA39BC4C1F52F9E295A6.jpeg';
    shipImage.src = 'https://e7.pngegg.com/pngimages/329/505/png-clipart-grey-and-red-fighting-jet-illustration-spacecraft-spaceship-file-miscellaneous-airplane.png';

    let meteorInterval;

    // Create a new meteor
    const createMeteor = () => {
      const size = Math.random() * 30 + 20;
      const x = Math.random() * canvas.width;
      const y = -size;
      setMeteors(prevMeteors => [...prevMeteors, { x, y, size }]);
    };

    // Update meteors position
    const updateMeteors = () => {
      setMeteors(prevMeteors =>
        prevMeteors
          .filter(meteor => meteor.y < canvas.height) // Remove meteors that go out of bounds
          .map(meteor => ({ ...meteor, y: meteor.y + meteorSpeed })) // Move meteors down
      );
    };

    // Update bullet position (move upwards)
    const updateBullets = () => {
      setBullets(prevBullets =>
        prevBullets
          .filter(bullet => bullet.y > 0) // Remove bullets that go out of bounds
          .map(bullet => ({ ...bullet, y: bullet.y - bulletSpeed })) // Move bullets upwards
      );
    };

    // Check for collisions between bullets and meteors
    const checkCollisions = () => {
      let updatedMeteors = [];
      let bulletsToRemove = new Set(); // Track bullets that hit meteors
    
      meteors.forEach(meteor => {
        let isHit = false;
    
        bullets.forEach((bullet, index) => {
          const bulletHit = (
            bullet.x > meteor.x &&
            bullet.x < meteor.x + meteor.size &&
            bullet.y > meteor.y &&
            bullet.y < meteor.y + meteor.size
          );
    
          if (bulletHit) {
            isHit = true;
            bulletsToRemove.add(index); // Mark bullet for removal
            setScore(prevScore => prevScore + 1);
          }
        });
    
        // Only keep meteors that were not hit
        if (!isHit) {
          updatedMeteors.push(meteor);
        }
      });
    
      // Filter out bullets that hit meteors
      const updatedBullets = bullets.filter((_, index) => !bulletsToRemove.has(index));
    
      // Update state with new arrays after all checks
      setBullets(updatedBullets);
      setMeteors(updatedMeteors);
    };
    
    
    

    // Draw background with scrolling effect
    const drawBackground = () => {
      context.drawImage(bgImage, 0, bgY, canvas.width, canvas.height); // Draw first background
      context.drawImage(bgImage, 0, bgY - canvas.height, canvas.width, canvas.height); // Draw second background on top of the first
    };

    // Update background position
    const updateBackground = () => {
      setBgY(prevBgY => (prevBgY + bgSpeed) % canvas.height); // Scroll background down and reset when it reaches the end
    };

    // Draw the spaceship at the current position
    const drawShip = () => {
      context.drawImage(shipImage, shipX.current - 20, shipY, 40, 40); // Draw spaceship
    };

    // Draw meteors
    const drawMeteors = () => {
      meteors.forEach(meteor => {
        context.beginPath();
        context.arc(meteor.x, meteor.y, meteor.size, 0, Math.PI * 2);
        context.fillStyle = 'gray';
        context.fill();
        context.closePath();
      });
    };

    // Draw bullets
    const drawBullets = () => {
      bullets.forEach(bullet => {
        context.beginPath();
        context.rect(bullet.x - 2, bullet.y - 10, 4, 10); // Draw bullet
        context.fillStyle = 'yellow';
        context.fill();
        context.closePath();
      });
    };

    // Main game loop
    const gameLoop = () => {
      context.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
      drawBackground(); // Draw scrolling background
      drawShip(); // Draw spaceship
      drawMeteors(); // Draw meteors
      drawBullets(); // Draw bullets
      checkCollisions(); // Check for collisions
      updateMeteors(); // Move meteors
      updateBullets(); // Move bullets
      updateBackground(); // Move background
    };

    const startGame = () => {
      if (!gameLoopRef.current) {  // Only start game loop if not already running
        gameLoopRef.current = setInterval(gameLoop, 1000 / FPS);
        meteorInterval = setInterval(createMeteor, 2000);
      }
    };

    const stopGame = () => {
      clearInterval(gameLoopRef.current);
      clearInterval(meteorInterval);
      gameLoopRef.current = null;  // Reset the game loop reference
    };

    bgImage.onload = () => {
      shipImage.onload = startGame;
    };

    return () => {
      stopGame();
    };
  }, [meteors, bullets, bgY]);

  const handleMouseClick = () => {
    createBullet();
  };

  const handleMouseMove = event => {
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = event.clientX - rect.left; // Get mouse position relative to canvas
    shipX.current = mouseX; // Update spaceship position
  };

  return (
    <>
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        style={{ border: '1px solid #000', display: 'block', margin: '0 auto' }}
        onMouseMove={handleMouseMove}
        onClick={handleMouseClick}  // Clicking creates bullet
      />
      <div style={{ textAlign: 'center', marginTop: '10px' }}>Score: {score}</div>
    </>
  );
};

export default Game;
