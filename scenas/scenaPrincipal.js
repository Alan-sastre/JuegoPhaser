class scenaPrincipal extends Phaser.Scene {
  constructor() {
    super({ key: "Principal", active: true });
  }

  preload() {
    this.load.image("tierra", "assets/scenaPrincipal/icon.png");
    this.load.image("fondo", "assets/scenaPrincipal/1.png");
    this.load.image("luna", "assets/scenaPrincipal/Luna.png");
    this.load.image("nube", "assets/scenaPrincipal/nube1.png");
    this.load.image("nube2", "assets/scenaPrincipal/nube2.png");
    this.load.spritesheet("estrella", "assets/scenaPrincipal/estrella.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet("fuga", "assets/scenaPrincipal/estrellafugas.png", {
      frameWidth: 128,
      frameHeight: 128,
    });
    this.load.audio("musica", "assets/scenaPrincipal/musica.mp3");
  }

  create() {
    const fondo = this.add.image(0, 0, "fondo");
    fondo.setOrigin(0, 0); // Asegura que la imagen comience desde la esquina superior izquierda
    fondo.displayWidth = this.scale.width; // Ajusta el ancho al tamaño de la pantalla
    fondo.displayHeight = this.scale.height; // Ajusta la altura al tamaño de la pantalla

    this.Terran = this.add.image(500, 80, "tierra").setScale(0.5);
    this.Luna = this.add.image(900, 70, "luna").setScale(0.1);
    this.nube = this.add.image(100, 200, "nube").setScale(0.3);
    this.nube2 = this.add.image(20, 100, "nube2").setScale(0.3);

    // La animación de la estrella
    this.anims.create({
      key: "parpadear",
      frames: this.anims.generateFrameNumbers("estrella", { start: 0, end: 3 }),
      frameRate: 4, // Velocidad de la animación
      repeat: -1, // Repetir la animación indefinidamente
    });

    // Añadir el sprite de la estrella y aplicar la animación
    const estrella = this.add.sprite(250, 370, "estrella");
    estrella.anims.play("parpadear");

    // Estrella fugaz

    // Crear la animación para la estrella fugaz
    this.anims.create({
      key: "fugaz",
      frames: this.anims.generateFrameNumbers("fuga", { start: 0, end: 9 }), 
      frameRate: 7, // Velocidad de la animación
      repeat: -1, // Repetir la animación indefinidamente
    });

    // Añadir el sprite de la estrella fugaz y aplicar la animación
    const estrellaFugaz = this.add.sprite(300, 100, "fuga");
    estrellaFugaz.anims.play("fugaz");

    // Titulo
    const titulo = this.add.text(
      this.scale.width / 2, // Posición X (centro de la pantalla)
      370, // Posición Y (parte superior)
      "Presiona la tecla ESPACIO para continuar",
      {
        fontSize: "20px",
        color: "#FFFFFF",
        fontStyle: "bold",
        align: "center",
      }
    );
    titulo.setOrigin(0.5); // el texto en X e Y

    const music = this.sound.add("musica", { loop: true, volume: 0.2 }); // Carga el sonido cargado // sonido en 0.2
    music.play(); // Inicia la reproducción

    this.capaNegra = this.add.graphics();
    this.capaNegra.fillStyle(0x000000, 1); // Negro sólido
    this.capaNegra.fillRect(0, 0, this.scale.width, this.scale.height);
    this.capaNegra.setAlpha(0); // Transparente al inicio

    // presionar la tecla ESPACIO
    this.input.keyboard.on("keydown-SPACE", () => {
      // Inicia la transición de oscurecimiento
      this.tweens.add({
        targets: this.capaNegra,
        alpha: 1, // Oscurecer
        duration: 1000, // 1 segundo
        onComplete: () => {
          console.log("Cambio de escena ejecutado");
          this.sound.stopAll(); // Detiene la música
          this.scene.start("scenaIntro", { fromFade: true }); // Cambia a la siguiente escena
        },
      });
    });
  }

  update() {
    this.nube.x -= 0.3;
    this.nube2.x += 0.3;

    if (this.nube.x < -50) this.nube.x = 850;
    if (this.nube2.x > 850) this.nube2.x = -50;
  }
}
