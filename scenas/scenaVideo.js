class VideoScene extends Phaser.Scene {
  constructor() {
    super({ key: "VideoScene" });
  }

  preload() {
    // Cargar el video (asegúrate de que la ruta sea correcta)
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

    // Agregar un fondo de color negro para cubrir áreas vacías
    this.add.rectangle(
      screenWidth / 2,
      screenHeight / 2,
      screenWidth,
      screenHeight,
      0x000000
    );

    // Crear el objeto de video
    const video = this.add.video(
      screenWidth / 2,
      screenHeight / 2,
      "introVideo"
    );

    // Obtener las dimensiones originales del video
    const videoWidth = video.width;
    const videoHeight = video.height;

    // Calcular la relación de aspecto del video y de la pantalla
    const videoAspectRatio = videoWidth / videoHeight;
    const screenAspectRatio = screenWidth / screenHeight;

    // Ajustar el tamaño del video manteniendo la relación de aspecto
    if (videoAspectRatio > screenAspectRatio) {
      // El video es más ancho que la pantalla
      video.setDisplaySize(screenWidth, screenWidth / videoAspectRatio);
    } else {
      // El video es más alto que la pantalla
      video.setDisplaySize(screenHeight * videoAspectRatio, screenHeight);
    }

    // Centrar el video en la pantalla
    video.setOrigin(0.5, 0.5);

    // Reproducir el video
    video.play();

    // Opcional: Cambiar de escena cuando el video termine
    video.on("complete", () => {
      this.scene.start("scenaJuego"); // Cambia 'scenaJuego' por la escena que desees
    });
  }
}