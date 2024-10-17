import React, { useRef, useEffect } from 'react';

const Game = () => {
  const canvasRef = useRef(null);
  const shipX = useRef(400); // Uzay gemisinin X pozisyonunu useRef ile takip et
  const shipY = 500; // Uzay gemisinin Y pozisyonu (sabit)
  const bgY = useRef(0); // Arkaplanın Y pozisyonunu useRef ile takip ediyoruz

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    let animationFrameId;

    // Arkaplan görseli
    const bgImage = new Image();
    bgImage.src =
      'https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/3eca82e9-3900-487c-be58-f5bb4d614fc6/original=true,quality=90/F8F735DF7AA70769647FB8132ED6A4D902E834504451CA39BC4C1F52F9E295A6.jpeg'; // Arkaplan görseli

    // Uzay gemisi görseli
    const shipImage = new Image();
    shipImage.src =
      'https://e7.pngegg.com/pngimages/329/505/png-clipart-grey-and-red-fighting-jet-illustration-spacecraft-spaceship-file-miscellaneous-airplane.png'; // Uzay gemisi görseli

    // Arkaplanı çizme fonksiyonu
    const drawBackground = () => {
      context.drawImage(bgImage, 0, bgY.current, canvas.width, canvas.height); // İlk arkaplan
      context.drawImage(
        bgImage,
        0,
        bgY.current - canvas.height,
        canvas.width,
        canvas.height
      ); // İkinci arkaplan
      bgY.current += 1; // Arkaplanı aşağı doğru kaydır
      if (bgY.current >= canvas.height) bgY.current = 0; // Sonsuz döngü
    };

    // Uzay gemisini çizme fonksiyonu
    const drawShip = () => {
      context.drawImage(shipImage, shipX.current - 20, shipY, 40, 40); // Gemiyi ortalamak için X'ten yarısı kadar çıkartıyoruz
    };

    // Oyun döngüsü
    const gameLoop = () => {
      context.clearRect(0, 0, canvas.width, canvas.height); // Ekranı temizle
      drawBackground(); // Arkaplanı çiz
      drawShip(); // Uzay gemisini çiz
      animationFrameId = requestAnimationFrame(gameLoop); // Oyun sürekli çalışsın
    };

    // Arkaplan ve gemi yüklendikten sonra döngüyü başlat
    bgImage.onload = () => {
      shipImage.onload = () => {
        gameLoop();
      };
    };

    // Cleanup fonksiyonu
    return () => cancelAnimationFrame(animationFrameId);
  }, []); // Yalnızca bir kez render edilecek ve gemi hareketinde tetiklenmeyecek

  // Mouse hareketini yakalama
  const handleMouseMove = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left; // Mouse'un canvas üzerindeki X pozisyonu
    shipX.current = mouseX; // Uzay gemisini mouse'un X pozisyonuna göre hareket ettir
  };

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={600}
      style={{ border: '1px solid #000', display: 'block', margin: '0 auto' }} // Canvas'ı ortalamak için margin
      onMouseMove={handleMouseMove} // Mouse hareketlerini takip et
    />
  );
};

export default Game;
