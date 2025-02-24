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

        // Acceder al elemento de video HTML
        const videoElement = video.video;
        videoElement.muted = true; // Iniciar el video en silencio para evitar bloqueos del navegador

        // Esperar a que el video esté listo para obtener su tamaño real
        video.on("play", () => {
        const videoWidth = videoElement.videoWidth;
        const videoHeight = videoElement.videoHeight;

        if (videoWidth && videoHeight) {
            const videoAspectRatio = videoWidth / videoHeight;
            const screenAspectRatio = screenWidth / screenHeight;

            if (videoAspectRatio > screenAspectRatio) {
            video.setDisplaySize(screenWidth, screenWidth / videoAspectRatio);
            } else {
            video.setDisplaySize(screenHeight * videoAspectRatio, screenHeight);
            }
        }
        });

        // Reproducir el video automáticamente
        video.play();

        // Cambiar de escena cuando el video termine
        video.on("complete", () => {
        this.scene.start("scenaJuego"); // Cambia 'scenaJuego' por la escena correcta
        });

        // --- Agregar botones de sonido ---
        const buttonStyle = {
        fontSize: "20px",
        fontFamily: "Arial",
        color: "#ffffff",
        backgroundColor: "#000000",
        padding: "10px",
        borderRadius: "5px",
        };

        // Botón para activar sonido
        const soundOnButton = this.add
        .text(screenWidth - 150, 50, "🔊 Sonido", buttonStyle)
        .setInteractive()
        .setOrigin(0.5)
        .on("pointerdown", () => {
            videoElement.muted = false;
            videoElement.volume = 1; // Asegurar que el volumen está al máximo
        });

        // Botón para silenciar
        const soundOffButton = this.add
        .text(screenWidth - 150, 100, "🔇 Silencio", buttonStyle)
        .setInteractive()
        .setOrigin(0.5)
        .on("pointerdown", () => {
            videoElement.muted = true;
        });

        // Mejorar la interactividad visual de los botones
        [soundOnButton, soundOffButton].forEach((button) => {
        button.setPadding(10);
        button.setStyle({ backgroundColor: "#222", borderRadius: "8px" });
        button.on("pointerover", () =>
            button.setStyle({ backgroundColor: "#444" })
        );
        button.on("pointerout", () =>
            button.setStyle({ backgroundColor: "#222" })
        );
        });
    }
    }
