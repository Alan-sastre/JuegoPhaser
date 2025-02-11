class scenaJuego extends Phaser.Scene {
  constructor() {
    super({ key: "scenaJuego" });
    this.puedeDisparar = true;
    this.tiempoEsperaDisparo = 300;
    this.score = 0;
    this.vida = 100;
    this.isMobile = false;
  }

  preload() {
    this.load.image("background", "assets/scenaJuego/fondo.png");
    this.load.image("planetas", "assets/scenaJuego/planetas.png");
    this.load.image("nave", "assets/scenaJuego/nave.png");
    this.load.image("GranPlaneta", "assets/scenaJuego/GranPlaneta.png");
    this.load.image("GranPlaneta2", "assets/scenaJuego/GranPlaneta2.png");
    this.load.image("estrellas", "assets/scenaJuego/estrellas.png");
    this.load.image("fondo1", "assets/scenaJuego/a.jpg");
    this.load.image("bala", "assets/scenaJuego/bala.png");
    this.load.image("nivel", "assets/scenaJuego/nivel1.jpg");
    this.load.spritesheet("enemigo", "assets/scenaJuego/enemigo.png", {
      frameWidth: 32,
      frameHeight: 32,
      endFrame: 7,
    });
    this.load.audio("sonidoDisparo", "assets/scenaJuego/disparo.mp3");
    this.load.audio("musicaJuego", "assets/scenaJuego/musicaPelea.mp3");
    this.load.audio("sonidoExplosion", "assets/scenaJuego/destruction.mp3");
    this.load.audio("sonidoGameOver", "assets/scenaJuego/game_over.mp3");

    // Cargar imágenes de los botones
    this.load.image("botonArriba", "assets/scenaJuego/arriba.png");
    this.load.image("botonAbajo", "assets/scenaJuego/abajo.png");
    this.load.image("botonIzquierda", "assets/scenaJuego/izquierda.png");
    this.load.image("botonDerecha", "assets/scenaJuego/derecha.png");
    this.load.image("botonDisparo", "assets/scenaJuego/disparo.png");
  }

  create() {
    this.isMobile =
      this.sys.game.device.os.android || this.sys.game.device.os.iOS;
    const { width, height } = this.scale.displaySize;

    // Ajustar el fondo para que ocupe toda la pantalla
    this.fondo = this.add.image(0, 0, "fondo1").setOrigin(0, 0);
    this.fondo.setScale(
      this.scale.width / this.fondo.width,
      this.scale.height / this.fondo.height
    );

    const nivel1Image = this.add
      .image(900, 20, "nivel")
      .setScale(0.2)
      .setDepth(10);

    // Añadir elementos del juego
    this.background = this.add.image(500, 350, "background").setScale(0.3);
    this.planetas = this.add.image(600, 200, "planetas").setScale(0.2);
    this.planetas2 = this.add.image(350, 500, "planetas").setScale(1);
    this.GranPlaneta = this.add.image(900, 100, "GranPlaneta").setScale(0.3);
    this.estrellas = this.add.image(100, 100, "estrellas").setScale(0.2);
    this.estrellas1 = this.add.image(200, 400, "estrellas").setScale(0.2);
    this.estrellas2 = this.add.image(800, 300, "estrellas").setScale(0.2);
    this.GranPlaneta2 = this.add.image(100, 450, "GranPlaneta2").setScale(1);

    // Sonidos
    this.sonidoDisparo = this.sound.add("sonidoDisparo");
    this.sonidoExplosion = this.sound.add("sonidoExplosion");
    this.sonidoGameOver = this.sound.add("sonidoGameOver");

    // Físicas de la nave
    this.nave = this.physics.add.sprite(200, 300, "nave");
    this.nave.setCollideWorldBounds(true);

    // Grupo de balas
    this.balas = this.physics.add.group({ defaultKey: "bala" });

    // Controles de teclado (solo para PC)
    if (!this.isMobile) {
      this.cursors = this.input.keyboard.createCursorKeys();
    }

    // Música
    this.musicaJuego = this.sound.add("musicaJuego", {
      loop: true,
      volume: 0.3,
    });
    this.musicaJuego.play();

    // Grupo de enemigos
    this.enemigos = this.physics.add.group();

    // Configurar la animación del enemigo
    this.anims.create({
      key: "enemigoAnim",
      frames: this.anims.generateFrameNumbers("enemigo", { start: 0, end: 7 }),
      frameRate: 10,
      repeat: -1,
    });

    // Colisiones entre balas y enemigos
    this.physics.add.collider(this.balas, this.enemigos, (bala, enemigo) => {
      bala.destroy();
      enemigo.destroy();
      this.score += 8;
      this.scoreText.setText(`Score: ${this.score}`);
      this.sonidoExplosion.play();
    });

    // Colisión entre la nave y los enemigos
    this.physics.add.collider(this.nave, this.enemigos, (nave, enemigo) => {
      this.naveParpadea();
      this.vida -= 25.5;
      this.actualizarBarraVida();
      enemigo.destroy();
      this.sonidoExplosion.play();
      if (this.vida <= 0) {
        this.gameOver();
      }
    });

    // Generar enemigos cada 2 segundos
    this.time.addEvent({
      delay: 2000,
      callback: this.generarEnemigo,
      callbackScope: this,
      loop: true,
    });

    // Texto del score
    this.scoreText = this.add.text(16, 16, "Score: 0", {
      fontSize: "32px",
      fill: "#fff",
    });

    // Barra de vida
    this.barraVida = this.add.graphics();
    this.actualizarBarraVida();

    // Controles táctiles (solo para móviles)
    if (this.isMobile) {
      this.addMobileControls();
    } else {
      // Controles de ratón (para PC)
      this.input.on("pointermove", this.moverNave, this);
      this.input.on("pointerdown", this.disparar, this);
    }
  }

  addMobileControls() {
    const { width, height } = this.scale.displaySize;

    // Tamaño de los botones (más grandes)
    const botonScale = 1.2; // Ajusta este valor para cambiar el tamaño de los botones

    // Posicionamiento de los botones de movimiento (abajo a la derecha)
    const offsetX = 50; // Espaciado horizontal entre botones
    const offsetY = 50; // Espaciado vertical entre botones
    const startX = width - 250; // Posición inicial en X (derecha)
    const startY = height - 50; // Posición inicial en Y (abajo)

    // Botón de arriba
    this.botonArriba = this.add
      .image(startX + offsetX, startY - offsetY, "botonArriba")
      .setInteractive()
      .setScale(botonScale)
      .setDepth(10);

    // Botón de abajo
    this.botonAbajo = this.add
      .image(startX + offsetX, startY + offsetY, "botonAbajo")
      .setInteractive()
      .setScale(botonScale)
      .setDepth(10);

    // Botón de izquierda
    this.botonIzquierda = this.add
      .image(startX, startY, "botonIzquierda")
      .setInteractive()
      .setScale(botonScale)
      .setDepth(10);

    // Botón de derecha
    this.botonDerecha = this.add
      .image(startX + 2 * offsetX, startY, "botonDerecha")
      .setInteractive()
      .setScale(botonScale)
      .setDepth(10);

    // Botón de disparo (abajo a la izquierda)
    this.botonDisparo = this.add
      .image(100, height - 100, "botonDisparo")
      .setInteractive()
      .setScale(botonScale)
      .setDepth(10);

    // Eventos de los botones
    this.botonArriba.on("pointerdown", () => {
      this.nave.setVelocityY(-200);
    });
    this.botonArriba.on("pointerup", () => {
      this.nave.setVelocityY(0);
    });

    this.botonAbajo.on("pointerdown", () => {
      this.nave.setVelocityY(200);
    });
    this.botonAbajo.on("pointerup", () => {
      this.nave.setVelocityY(0);
    });

    this.botonIzquierda.on("pointerdown", () => {
      this.nave.setVelocityX(-200);
    });
    this.botonIzquierda.on("pointerup", () => {
      this.nave.setVelocityX(0);
    });

    this.botonDerecha.on("pointerdown", () => {
      this.nave.setVelocityX(200);
    });
    this.botonDerecha.on("pointerup", () => {
      this.nave.setVelocityX(0);
    });

    this.botonDisparo.on("pointerdown", () => {
      this.disparar();
    });
  }

  actualizarBarraVida() {
    this.barraVida.clear();
    this.barraVida.fillStyle(0xff0000, 1);
    this.barraVida.fillRect(16, 60, this.vida, 20);
  }

  gameOver() {
    this.musicaJuego.stop();
    this.sonidoGameOver.play();
    this.add
      .text(this.scale.width / 2 - 100, this.scale.height / 2, "Game Over", {
        fontSize: "48px",
        fill: "#fff",
      })
      .setOrigin(0.5);

    // Reiniciar el juego después de 3 segundos
    this.time.delayedCall(3000, () => {
      this.vida = 100;
      this.actualizarBarraVida();
      this.scene.restart();
    });
  }

  moverNave(pointer) {
    this.nave.x = pointer.x;
    this.nave.y = pointer.y;
  }

  generarEnemigo() {
    const x = this.scale.width + 50;
    const y = Phaser.Math.Between(50, this.scale.height - 50);

    const enemigo = this.enemigos.create(x, y, "enemigo");
    enemigo.setVelocityX(-100);
    enemigo.anims.play("enemigoAnim");

    // Eliminar el enemigo cuando sale de la pantalla
    enemigo.setCollideWorldBounds(false);
    enemigo.checkWorldBounds = true;
    enemigo.outOfBoundsKill = true;
  }

  disparar() {
    if (this.puedeDisparar) {
      const bala = this.balas.get(this.nave.x + 40, this.nave.y + 10);
      if (bala) {
        bala.setActive(true);
        bala.setVisible(true);
        bala.body.setVelocityX(300);
        this.sonidoDisparo.play();

        this.puedeDisparar = false;
        this.time.delayedCall(this.tiempoEsperaDisparo, () => {
          this.puedeDisparar = true;
        });
      }
    }
  }

  naveParpadea() {
    this.nave.setAlpha(0.5);
    this.time.delayedCall(100, () => {
      this.nave.setAlpha(1);
    });
  }

  update() {
    // Movimiento de los elementos en pantalla
    this.GranPlaneta.x -= 0.03;
    this.planetas.x -= 1;
    this.planetas2.x -= 1;
    this.estrellas.x -= 1;
    this.estrellas1.x -= 1;
    this.estrellas2.x -= 1;

    // Reiniciar posición de los elementos cuando salen de la pantalla
    if (this.planetas.x < -50) this.planetas.x = 850;
    if (this.planetas2.x < -50) this.planetas2.x = 850;
    if (this.GranPlaneta.x < -100) this.GranPlaneta.x = 900;
    if (this.estrellas.x < -50) this.estrellas.x = 850;
    if (this.estrellas1.x < -50) this.estrellas1.x = 850;
    if (this.estrellas2.x < -50) this.estrellas2.x = 850;

    // Eliminar balas fuera de pantalla
    this.balas.children.each((bala) => {
      if (bala.active && bala.x > this.scale.width) {
        bala.setActive(false);
        bala.setVisible(false);
      }
    });
  }
}
