class VideoScene extends Phaser.Scene {
  constructor() {
    super({ key: "VideoScene" });
  }

  preload() {

    this.load.video(
      "introVideo",
      "assets/scenaVideo/introduccionVideo.mp4",
      "loadeddata",
      false,
      true
    );
  }

  create() {
    // Obtener las dimensiones de la pantalla
    const screenWidth = this.sys.game.config.width;
    const screenHeight = this.sys.game.config.height;

    // Crear el objeto de video
    const video = this.add.video(
      screenWidth / 2,
      screenHeight / 2,
      "introVideo"
    );


    video.setDisplaySize(screenWidth, screenHeight);


    video.play();


    video.on("complete", () => {
      this.scene.start("scenaJuego"); 
    });
  }
}
