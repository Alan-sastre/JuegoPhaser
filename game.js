function isMobile() {
  return /Android|iPhone|iPad|iPod|Windows Phone/i.test(navigator.userAgent);
}

var config = {
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: isMobile() ? 1000 : 1280, // Ancho diferente para móviles y PC
    height: isMobile() ? 500 : 720, // Alto diferente para móviles y PC
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  render: {
    pixelArt: true,
    antialias: false,
  },
  scene: [scenaJuego], //scenaPrincipal, scenaIntro, scenaRompecabezas,
};

// Prevenir el zoom por doble toque
document.addEventListener('touchstart', function(event) {
    if (event.touches.length > 1) {
        event.preventDefault();
    }
}, { passive: false });

// Prevenir el zoom por gestos
document.addEventListener('gesturestart', function(event) {
    event.preventDefault();
}, { passive: false });

var game = new Phaser.Game(config);
