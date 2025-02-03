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
    this.sonidoDisparo = this.sound.add("sonidoDisparo"), {volume: 0.1} ;

    // Físicas de la nave
    this.nave = this.physics.add.sprite(200, 300, "nave");
    this.nave.setCollideWorldBounds(true);

    //
    this.balas = this.physics.add.group({
      defaultKey: "bala",
    });

    // Controles de movimiento de la nave
    this.cursors = this.input.keyboard.createCursorKeys();

    // Reproducir música
    const music = this.sound.add("musicaJuego", { loop: true, volume: 0.2 });
    music.play();

    // clic para disparar
    this.input.on("pointerdown", this.disparar, this);

  }

  disparar() {
    const bala = this.balas.get(this.nave.x + 40, this.nave.y + 10); // Posición inicial de la bala
    if (bala) {
      bala.setActive(true);
      bala.setVisible(true);
      bala.body.setVelocityX(300); // Velocidad de la bala hacia arriba

      // Reproducir el sonido de disparo
      this.sonidoDisparo.play();
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

    // Reiniciar posición si los elementos salen del lado izquierdo de la pantalla
    if (this.planetas.x < -50) this.planetas.x = 850;
    if (this.planetas2.x < -50) this.planetas2.x = 850;
    if (this.GranPlaneta.x < -100) this.GranPlaneta.x = 900;
    if (this.estrellas.x < -50) this.estrellas.x = 850;
    if (this.estrellas1.x < -50) this.estrellas1.x = 850;
    if (this.estrellas2.x < -50) this.estrellas2.x = 850;

    // Reinicia la velocidad de la nave
    this.nave.setVelocity(0);

    // Controles básicos de movimiento
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

    // Desactivar y ocultar las balas que están fuera de pantalla
    this.balas.children.each((bala) => {
      if (bala.active && bala.y < 0) {
        bala.setActive(false);
        bala.setVisible(false);
      }
    });
  }
}
