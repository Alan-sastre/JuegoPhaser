class scenaJuego extends Phaser.Scene {
  constructor() {
    super({ key: "scenaJuego" });
  }

  preload() {
    this.load.image("background", "assets/scenaJuego/fondo.png");
    this.load.image("planetas", "assets/scenaJuego/planetas.png");
    this.load.image("nave", "assets/scenaJuego/nave.png");
    this.load.image("GranPlaneta", "assets/scenaJuego/GranPlaneta.png");
    this.load.image("GranPlaneta2", "assets/scenaJuego/GranPlaneta2.png");
    this.load.image("estrellas", "assets/scenaJuego/estrellas.png");
    this.load.image("fondo", "assets/scenaJuego/fondoAzul.png");
    this.load.image("bala", "assets/scenaJuego/bala.png");
    this.load.audio("sonidoDisparo", "assets/scenaJuego/disparo.mp3");
    this.load.audio("musicaJuego", "assets/musicaSpaceLoop.mp3");
  }

  create() {
    this.fondo = this.add.image(500, 250, "fondo").setScale();
    this.background = this.add.image(500, 350, "background").setScale(0.3);
    this.planetas = this.add.image(600, 200, "planetas").setScale(0.2);
    this.planetas2 = this.add.image(350, 500, "planetas").setScale(1);
    this.GranPlaneta = this.add.image(900, 100, "GranPlaneta").setScale(0.3);
    this.estrellas = this.add.image(100, 100, "estrellas").setScale(0.2);
    this.estrellas1 = this.add.image(200, 400, "estrellas").setScale(0.2);
    this.estrellas2 = this.add.image(800, 300, "estrellas").setScale(0.2);
    this.GranPlaneta2 = this.add.image(100, 450, "GranPlaneta2").setScale(1);

    this.sonidoDisparo = this.sound.add("sonidoDisparo");

    // Físicas de la nave
    this.nave = this.physics.add.sprite(200, 300, "nave");
    this.nave.setCollideWorldBounds(true);

    this.balas = this.physics.add.group({ defaultKey: "bala" });

    // Controles de teclado
    this.cursors = this.input.keyboard.createCursorKeys();

    // Música del juego
    this.music = this.sound.add("musicaJuego", { loop: true, volume: 0.2 });
    this.music.play();

    // Controles táctiles
    this.input.on("pointermove", this.moverNave, this);
    this.input.on("pointerdown", this.disparar, this);
  }

  moverNave(pointer) {
    // Si toca la izquierda de la pantalla, mueve la nave
    if (pointer.x < this.scale.width / 2) {
      this.nave.x = pointer.x;
      this.nave.y = pointer.y;
    }
  }

  disparar(pointer) {
    // Solo dispara si se toca la parte derecha de la pantalla
    if (pointer.x > this.scale.width / 2) {
      const bala = this.balas.get(this.nave.x + 40, this.nave.y + 10);
      if (bala) {
        bala.setActive(true);
        bala.setVisible(true);
        bala.body.setVelocityX(300);
        this.sonidoDisparo.play();
      }
    }
  }

  update() {
    // Movimiento de los elementos en pantalla
    this.GranPlaneta.x -= 0.03;
    this.planetas.x -= 1;
    this.planetas2.x -= 1;
    this.estrellas.x -= 1;
    this.estrellas1.x -= 1;
    this.estrellas2.x -= 1;

    if (this.planetas.x < -50) this.planetas.x = 850;
    if (this.planetas2.x < -50) this.planetas2.x = 850;
    if (this.GranPlaneta.x < -100) this.GranPlaneta.x = 900;
    if (this.estrellas.x < -50) this.estrellas.x = 850;
    if (this.estrellas1.x < -50) this.estrellas1.x = 850;
    if (this.estrellas2.x < -50) this.estrellas2.x = 850;

    // Reinicia la velocidad de la nave
    this.nave.setVelocity(0);

    // Controles de teclado
    if (this.cursors.left.isDown) {
      this.nave.setVelocityX(-200);
    } else if (this.cursors.right.isDown) {
      this.nave.setVelocityX(200);
    }
    if (this.cursors.up.isDown) {
      this.nave.setVelocityY(-200);
    } else if (this.cursors.down.isDown) {
      this.nave.setVelocityY(200);
    }

    // Eliminar balas fuera de pantalla
    this.balas.children.each((bala) => {
      if (bala.active && bala.y < 0) {
        bala.setActive(false);
        bala.setVisible(false);
      }
    });
  }
}
