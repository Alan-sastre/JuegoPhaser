class VideoScene extends Phaser.Scene {
  constructor() {
    super({ key: "VideoScene" });
  }

  preload() {
    // Cargar el video con la ruta correcta
    this.load.video(
      "introVideo",
      "assets/scenaVideo/introduccionVideo.mp4",
      "loadeddata"
    );
  }

  create() {
    const screenWidth = this.sys.game.config.width;
    const screenHeight = this.sys.game.config.height;

    // Agregar un fondo negro para cubrir áreas vacías
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

    // Esperar a que el video esté listo para obtener su tamaño real
    video.on("play", () => {
      const videoElement = video.video; // Referencia al elemento de video HTML
      const videoWidth = videoElement.videoWidth;
      const videoHeight = videoElement.videoHeight;

      if (videoWidth && videoHeight) {
        const videoAspectRatio = videoWidth / videoHeight;
        const screenAspectRatio = screenWidth / screenHeight;

        if (videoAspectRatio > screenAspectRatio) {
          // Si el video es más ancho que la pantalla, ajustamos el ancho
          video.setDisplaySize(screenWidth, screenWidth / videoAspectRatio);
        } else {
          // Si el video es más alto que la pantalla, ajustamos la altura
          video.setDisplaySize(screenHeight * videoAspectRatio, screenHeight);
        }
      }
    });

    // Reproducir el video
    video.play();

    // Cambiar de escena cuando el video termine
    video.on("complete", () => {
      this.scene.start("scenaJuego"); // Cambia 'scenaJuego' por la escena correcta
    });
  }
}
