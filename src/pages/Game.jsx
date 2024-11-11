import React, { useRef, useEffect, useState } from 'react';

const Game = () => {
  // Canvas and spaceship position references
  const canvasRef = useRef(null);
  const shipX = useRef(400);  // X position of spaceship
  const shipY = 500;          // Fixed Y position of spaceship
  const [meteors, setMeteors] = useState([]);   // Meteor array state
  const [bullets, setBullets] = useState([]);   // Bullet array state
  const [score, setScore] = useState(0);        // Score state
  const [highScores, setHighScores] = useState([]); // High score list state
  const [health, setHealth] = useState(3);      // Health state

  // Game constants
  const meteorSpeed = 3;
  const bulletSpeed = 5;
  const FPS = 60;
  const gameLoopRef = useRef(null);  // Game loop reference for starting and stopping
  const [bgY, setBgY] = useState(0); // Background vertical position state
  const bgSpeed = 2;                 // Speed of background scrolling

  // Load high scores from local storage
  useEffect(() => {
    const storedScores = JSON.parse(localStorage.getItem('highScores')) || [];
    setHighScores(storedScores);
  }, []);

  // Save high scores to local storage
  const saveHighScores = (newScores) => {
    localStorage.setItem('highScores', JSON.stringify(newScores));
  };

  // Function to update high scores if needed
  const updateHighScores = (newScore) => {
    const updatedScores = [...highScores, newScore].sort((a, b) => b - a).slice(0, 5);
    setHighScores(updatedScores);
    saveHighScores(updatedScores);
  };

  // Function to create a new bullet at the spaceship's position
  const createBullet = () => {
    setBullets(prevBullets => [
      ...prevBullets,
      { x: shipX.current, y: shipY }
    ]);
  };

  useEffect(() => {
    // Set up canvas and images
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const bgImage = new Image();
    const shipImage = new Image();

    // Background and spaceship image sources
    bgImage.src = 'https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/3eca82e9-3900-487c-be58-f5bb4d614fc6/original=true,quality=90/F8F735DF7AA70769647FB8132ED6A4D902E834504451CA39BC4C1F52F9E295A6.jpeg';
    shipImage.src = 'https://e7.pngegg.com/pngimages/329/505/png-clipart-grey-and-red-fighting-jet-illustration-spacecraft-spaceship-file-miscellaneous-airplane.png';

    let meteorInterval;  // Reference for the interval that creates meteors

    // Function to create a new meteor at a random position above the canvas
    const createMeteor = () => {
      const size = Math.random() * 30 + 20;  // Random size between 20 and 50
      const x = Math.random() * canvas.width;
      const y = -size;
      setMeteors(prevMeteors => [...prevMeteors, { x, y, size }]);
    };

    // Move meteors downward and remove those that go out of bounds
    const updateMeteors = () => {
      setMeteors(prevMeteors =>
        prevMeteors.filter(meteor => meteor.y < canvas.height)
                    .map(meteor => ({ ...meteor, y: meteor.y + meteorSpeed }))
      );
    };

    // Move bullets upward and remove those that go out of bounds
    const updateBullets = () => {
      setBullets(prevBullets =>
        prevBullets.filter(bullet => bullet.y > 0)
          .map(bullet => ({ ...bullet, y: bullet.y - bulletSpeed }))
      );
    };

    // Check for collisions between bullets and meteors and between the spaceship and meteors
    const checkCollisions = () => {
      let updatedMeteors = [];
      let bulletsToRemove = new Set(); // Track bullets that hit meteors
    
      meteors.forEach(meteor => {
        let isHit = false;
    
        // Check if any bullet hits the meteor
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
            setScore(prevScore => prevScore + 1); // Increase score
          }
        });
    
        // Check for collision between spaceship and meteor
        const shipCollision = (
          !meteor.isCollided && // Check if meteor was already collided
          shipX.current > meteor.x - 20 &&
          shipX.current < meteor.x + meteor.size + 20 &&
          shipY > meteor.y &&
          shipY < meteor.y + meteor.size
        );
    
        if (shipCollision) {
          meteor.isCollided = true; // Mark meteor as collided
          if (health > 1) {
            setHealth(prevHealth => prevHealth - 1); // Decrease health
          } else {
            resetGame(); // Reset the game if health reaches 0
          }
        }
    
        // Only keep meteors that were not hit
        if (!isHit) {
          updatedMeteors.push(meteor);
        }
      });
    
      // Filter out bullets that hit meteors
      const updatedBullets = bullets.filter((_, index) => !bulletsToRemove.has(index));
    
      setBullets(updatedBullets);    // Update bullets
      setMeteors(updatedMeteors);    // Update meteors
    };

    // Draw background with scrolling effect
    const drawBackground = () => {
      context.drawImage(bgImage, 0, bgY, canvas.width, canvas.height); // First background layer
      context.drawImage(bgImage, 0, bgY - canvas.height, canvas.width, canvas.height); // Second layer
    };

    // Scroll the background downwards and reset when it reaches the end
    const updateBackground = () => {
      setBgY(prevBgY => (prevBgY + bgSpeed) % canvas.height);
    };

    // Draw spaceship at current position
    const drawShip = () => {
      context.drawImage(shipImage, shipX.current - 20, shipY, 40, 40);
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
        context.rect(bullet.x - 2, bullet.y - 10, 4, 10);
        context.fillStyle = 'yellow';
        context.fill();
        context.closePath();
      });
    };

    // Main game loop: clears canvas, draws elements, and updates positions
    const gameLoop = () => {
      context.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
      drawBackground();
      drawShip();
      drawMeteors();
      drawBullets();
      checkCollisions();
      updateMeteors();
      updateBullets();
      updateBackground();
    };

    // Start the game loop and set up meteor spawning
    const startGame = () => {
      if (!gameLoopRef.current) {
        gameLoopRef.current = setInterval(gameLoop, 1000 / FPS); // Start game loop
        meteorInterval = setInterval(createMeteor, 2000);        // Spawn new meteors
      }
    };

    // Stop the game loop and meteor spawning
    const stopGame = () => {
      clearInterval(gameLoopRef.current);
      clearInterval(meteorInterval);
      gameLoopRef.current = null;
    };



    bgImage.onload = () => startGame(); // Start the game once background image is loaded

    return () => stopGame(); // Cleanup on component unmount
  }, [bullets, meteors, score, highScores, health, bgY]);

        // Function to reset the game (clear meteors, bullets, reset score, reinitialize health, and restart game loop)
        const resetGame = () => {
          updateHighScores(score); // Update high scores with the final score
          setMeteors([]);
          setBullets([]);
          setScore(0);
          setHealth(3);  // Reset health to initial value
          stopGame();    // Stop the current game loop and meteor generation
          startGame();   // Start a new game loop
        };

  // Handle spaceship movement based on mouse position
  const handleMouseMove = (event) => {
    const canvas = canvasRef.current;
    const canvasRect = canvas.getBoundingClientRect();
    shipX.current = event.clientX - canvasRect.left;
  };

  // Handle mouse click to shoot bullets
  const handleMouseClick = () => {
    createBullet();
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
      <div style={{ textAlign: 'center', marginTop: '10px' }}>Health: {health}</div>
      <div style={{ textAlign: 'center', marginTop: '20px', maxWidth: '400px', margin: '0 auto' }}>
        <h3 style={{ marginBottom: '10px' }}>High Scores</h3>
        <ul style={{
          listStyleType: 'none',
          padding: 0,
          margin: 0,
          border: '1px solid #ddd',
          borderRadius: '8px',
          backgroundColor: '#f5f5f5',
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)'
        }}>
          {highScores.map((highScore, index) => (
            <li key={index} style={{
              padding: '10px',
              borderBottom: index < highScores.length - 1 ? '1px solid #ddd' : 'none',
              textAlign: 'center',
              fontSize: '16px',
              color: '#333'
            }}>
              Score: {highScore}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Game;
