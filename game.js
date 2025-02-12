var config = {
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    orientation: isMobile() ? Phaser.Scale.Orientation.LANDSCAPE : Phaser.Scale.Orientation.ANY, // Forza horizontal solo en móviles
    width: 1000,
    height: 500,
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

  scene: [scenaPrincipal, scenaIntro, scenaRompecabezas, scenaJuego],
};

var game = new Phaser.Game(config);
