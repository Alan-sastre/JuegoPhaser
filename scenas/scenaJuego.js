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
    let scaleFactor = this.scale.width > 800 ? 0.5 : 0.3;
    this.background = this.add
      .image(this.scale.width / 2, this.scale.height / 1.4, "background")
      .setScale(scaleFactor);

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

    // Controles de PC (ratón y teclado)
    if (!this.isMobile) {
      // Movimiento de la nave con el ratón
      this.input.on("pointermove", (pointer) => {
        this.nave.x = pointer.x;
        this.nave.y = pointer.y;
      });

      // Disparar con clic del ratón
      this.input.on("pointerdown", () => {
        this.disparar();
      });
    }

    // Controles táctiles (solo para móviles)
    if (this.isMobile) {
      this.addMobileControls();
    }
  }

  addMobileControls() {
    const { width, height } = this.scale.displaySize;

    // Tamaño de los botones (ajustado para móviles)
    const botonScale = Math.min(width, height) * 0.003; // Escalado relativo
    const botonDisparoScale = botonScale * 1.7;

    // Posicionamiento de los botones de movimiento (en la esquina inferior derecha)
    const offsetX = width * 0.08; // Aumentado de 0.05 a 0.08
    const offsetY = height * 0.08; // Aumentado de 0.05 a 0.08
    const startX = width * 0.85; // 85% del ancho de la pantalla
    const startY = height * 0.85; // 85% de la altura de la pantalla

    this.movementState = {
      up: false,
      down: false,
      left: false,
      right: false,
    };

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

    // Botón de disparo (posicionado en la esquina inferior izquierda)
    this.botonDisparo = this.add
      .image(width * 0.15, height * 0.85, "botonDisparo")
      .setInteractive()
      .setScale(botonDisparoScale)
      .setDepth(10);

    this.botonArriba.on("pointerdown", () => {
      this.movementState.up = true;
      this.updateMovement();
    });
    this.botonArriba.on("pointerup", () => {
      this.movementState.up = false;
      this.updateMovement();
    });
    this.botonArriba.on("pointerout", () => {
      this.movementState.up = false;
      this.updateMovement();
    });

    this.botonAbajo.on("pointerdown", () => {
      this.movementState.down = true;
      this.updateMovement();
    });
    this.botonAbajo.on("pointerup", () => {
      this.movementState.down = false;
      this.updateMovement();
    });
    this.botonAbajo.on("pointerout", () => {
      this.movementState.down = false;
      this.updateMovement();
    });

    this.botonIzquierda.on("pointerdown", () => {
      this.movementState.left = true;
      this.updateMovement();
    });
    this.botonIzquierda.on("pointerup", () => {
      this.movementState.left = false;
      this.updateMovement();
    });
    this.botonIzquierda.on("pointerout", () => {
      this.movementState.left = false;
      this.updateMovement();
    });

    this.botonDerecha.on("pointerdown", () => {
      this.movementState.right = true;
      this.updateMovement();
    });
    this.botonDerecha.on("pointerup", () => {
      this.movementState.right = false;
      this.updateMovement();
    });
    this.botonDerecha.on("pointerout", () => {
      this.movementState.right = false;
      this.updateMovement();
    });

    // Evento de disparo independiente
    this.botonDisparo.on("pointerdown", () => {
      if (!this.disparoInterval) {
        this.disparoInterval = this.time.addEvent({
          delay: this.tiempoEsperaDisparo,
          callback: () => this.disparar(),
          loop: true,
        });
        // Disparo inicial inmediato
        this.disparar();
      }
    });

    this.botonDisparo.on("pointerup", () => {
      if (this.disparoInterval) {
        this.disparoInterval.remove();
        this.disparoInterval = null;
      }
    });

    this.botonDisparo.on("pointerout", () => {
      if (this.disparoInterval) {
        this.disparoInterval.remove();
        this.disparoInterval = null;
      }
    });
  }
  updateMovement() {
    let velocityX = 0;
    let velocityY = 0;
    const speed = 200;

    if (this.movementState.up) velocityY -= speed;
    if (this.movementState.down) velocityY += speed;
    if (this.movementState.left) velocityX -= speed;
    if (this.movementState.right) velocityX += speed;

    this.nave.setVelocity(velocityX, velocityY);
  }


  actualizarBarraVida() {
    this.barraVida.clear();
    this.barraVida.fillStyle(0xff0000, 1);
    this.barraVida.fillRect(16, 60, this.vida, 20);
  }

  gameOver() {
    this.musicaJuego.stop();
    this.sonidoGameOver.play();

    // Detener el movimiento de la nave y enemigos
    this.nave.setVelocity(0, 0);
    this.enemigos.children.each((enemigo) => {
      enemigo.setVelocity(0, 0);
    });

    // Detener la generación de enemigos
    this.eventos?.forEach((evento) => evento.remove());

    // Mostrar texto de Game Over
    const gameOverText = this.add
      .text(this.scale.width / 2, this.scale.height / 2, "Game Over", {
        fontSize: "36px",
        fontStyle: "bold",
        fill: "#fff",
        backgroundColor: "transparent",
        padding: { x: 20, y: 10 },
        shadow: {
          offsetX: 4,
          offsetY: 4,
          color: "#000",
          blur: 4,
          fill: true,
        },
        stroke: "#000",
        strokeThickness: 4,
      })
      .setOrigin(0.5);

    // Botón de reinicio con animación de parpadeo
    const reiniciarBtn = this.add
      .text(this.scale.width / 2, this.scale.height / 2 + 60, "Reiniciar", {
        fontSize: "36px",
        fontStyle: "bold",
        fill: "#fff",
        backgroundColor: "transparent",
        padding: { x: 20, y: 10 },
        shadow: {
          offsetX: 4,
          offsetY: 4,
          color: "#000",
          blur: 4,
          fill: true,
        },
        stroke: "#000",
        strokeThickness: 4,
      })
      .setOrigin(0.5)
      .setInteractive();

    // Animación de parpadeo SOLO para "Reiniciar"
    this.tweens.add({
      targets: reiniciarBtn,
      alpha: 0, // Hace que desaparezca
      duration: 500, // Tiempo en milisegundos
      yoyo: true, // Hace que vuelva a aparecer
      repeat: -1, // Se repite infinitamente
    });

    // Evento del botón de reinicio
    reiniciarBtn.on("pointerdown", () => {
      this.reiniciarJuego();
    });
  }

  reiniciarJuego() {
    // Reiniciar variables del juego
    this.score = 0;
    this.vida = 100;
    this.scoreText.setText(`Score: ${this.score}`);
    this.actualizarBarraVida();

    // Limpiar enemigos existentes
    this.enemigos.clear(true, true);

    // Reposicionar la nave
    this.nave.x = 200;
    this.nave.y = 300;
    this.nave.setAlpha(1);

    // Limpiar balas existentes
    this.balas.clear(true, true);

    // Reiniciar la música
    this.musicaJuego.play();

    // Eliminar textos de Game Over
    this.children.list
      .filter((child) => child instanceof Phaser.GameObjects.Text)
      .forEach((text) => {
        if (text !== this.scoreText) {
          text.destroy();
        }
      });

    // Reactivar la generación de enemigos
    this.eventos = [
      this.time.addEvent({
        delay: 2000,
        callback: this.generarEnemigo,
        callbackScope: this,
        loop: true,
      }),
    ];

    // Reactivar la capacidad de disparar
    this.puedeDisparar = true;
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
