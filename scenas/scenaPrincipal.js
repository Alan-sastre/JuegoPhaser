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
    const { width, height } = this.scale;

    const fondo = this.add.image(0, 0, "fondo");
    fondo.setOrigin(0, 0);
    fondo.displayWidth = width;
    fondo.displayHeight = height;

    this.Terran = this.add
      .image(width * 0.4, height * 0.15, "tierra")
      .setScale(0.5);
    this.Luna = this.add.image(width * 0.8, height * 0.1, "luna").setScale(0.1);
    this.nube = this.add.image(width * 0.2, height * 0.3, "nube").setScale(0.3);
    this.nube2 = this.add
      .image(width * 0.1, height * 0.2, "nube2")
      .setScale(0.3);

    this.anims.create({
      key: "parpadear",
      frames: this.anims.generateFrameNumbers("estrella", { start: 0, end: 3 }),
      frameRate: 4,
      repeat: -1,
    });

    const estrella = this.add.sprite(width * 0.5, height * 0.7, "estrella");
    estrella.anims.play("parpadear");

    this.anims.create({
      key: "fugaz",
      frames: this.anims.generateFrameNumbers("fuga", { start: 0, end: 9 }),
      frameRate: 7,
      repeat: -1,
    });

    const estrellaFugaz = this.add.sprite(width * 0.6, height * 0.2, "fuga");
    estrellaFugaz.anims.play("fugaz");

    const titulo = this.add.text(
      width / 2,
      height * 0.9,
      "Toca la pantalla o presiona ESPACIO para continuar",
      {
        fontSize: "18px",
        color: "#FFFFFF",
        fontStyle: "bold",
        align: "center",
      }
    );
    titulo.setOrigin(0.5);

    const music = this.sound.add("musica", { loop: true, volume: 0.2 });
    music.play();

    this.capaNegra = this.add.graphics();
    this.capaNegra.fillStyle(0x000000, 1);
    this.capaNegra.fillRect(0, 0, width, height);
    this.capaNegra.setAlpha(0);

    const iniciarTransicion = () => {
      this.tweens.add({
        targets: this.capaNegra,
        alpha: 1,
        duration: 1000,
        onComplete: () => {
          console.log("Cambio de escena ejecutado");
          this.sound.stopAll();
          this.scene.start("scenaIntro", { fromFade: true });
        },
      });
    };

    this.input.keyboard.on("keydown-SPACE", iniciarTransicion);
    this.input.on("pointerdown", iniciarTransicion);
  }

  update() {
    this.nube.x -= 0.3;
    this.nube2.x += 0.3;

    if (this.nube.x < -50) this.nube.x = this.scale.width + 50;
    if (this.nube2.x > this.scale.width + 50) this.nube2.x = -50;
  }
}
