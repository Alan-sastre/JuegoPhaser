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

    // Configurar el escalado correcto
    this.scale.on("resize", (gameSize, baseSize, displaySize, resolution) => {
      this.cameras.main.setViewport(0, 0, gameSize.width, gameSize.height);
      this.resetGameElements();
    });

    // Inicializar el juego con un pequeño retraso para asegurar dimensiones correctas
    this.time.delayedCall(100, () => {
      this.initializeGame();
    });
  }

  resize() {
    if (this.isMobile) {
      // Eliminar controles existentes si los hay
      this.removeExistingControls();
      // Recrear los controles con las nuevas dimensiones
      this.addMobileControls();
    }
  }

  removeExistingControls() {
    // Eliminar botones existentes si existen
    if (this.botonArriba) this.botonArriba.destroy();
    if (this.botonAbajo) this.botonAbajo.destroy();
    if (this.botonIzquierda) this.botonIzquierda.destroy();
    if (this.botonDerecha) this.botonDerecha.destroy();
    if (this.botonDisparo) this.botonDisparo.destroy();
  }

  initializeGame() {
    const { width, height } = this.scale.displaySize;

    // Ajustar el fondo para que ocupe toda la pantalla
    this.fondo = this.add.image(0, 0, "fondo1").setOrigin(0, 0);
    this.fondo.setScale(
      this.scale.width / this.fondo.width,
      this.scale.height / this.fondo.height
    );

    //const { width, height } = this.scale.displaySize;

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
      // Esperar un pequeño momento para asegurarse de que las dimensiones estén estables
      this.time.delayedCall(100, () => {
        this.addMobileControls();
      });
    }
  }

  resetGameElements() {
    // Limpiar controles existentes si los hay
    if (this.isMobile) {
      this.removeExistingControls();
      this.addMobileControls();
    }

    // Reajustar el fondo
    if (this.fondo) {
      this.fondo.setScale(
        this.scale.width / this.fondo.width,
        this.scale.height / this.fondo.height
      );
    }

    // Reposicionar otros elementos si es necesario
    // ... ajustar posición de otros elementos según sea necesario
  }

  addMobileControls() {
    const { width, height } = this.scale.displaySize;

    // Asegurarse de que las dimensiones sean válidas
    if (width <= 0 || height <= 0) {
      console.warn("Invalid dimensions, retrying...");
      this.time.delayedCall(100, () => this.addMobileControls());
      return;
    }

    const botonScale = Math.min(width, height) * 0.004;
    const botonDisparoScale = botonScale * 1.6;

    const offsetX = width * 0.09;
    const offsetY = height * 0.09;
    const startX = width * 0.85;
    const startY = height * 0.85;

    // Configurar el input para multitoque
    this.input.addPointer(3); // Permite hasta 3 puntos de toque simultáneos

    // Botones de movimiento
    this.botonArriba = this.add
      .image(startX + offsetX, startY - offsetY, "botonArriba")
      .setInteractive()
      .setScale(botonScale)
      .setDepth(10);

    this.botonAbajo = this.add
      .image(startX + offsetX, startY + offsetY, "botonAbajo")
      .setInteractive()
      .setScale(botonScale)
      .setDepth(10);

    this.botonIzquierda = this.add
      .image(startX, startY, "botonIzquierda")
      .setInteractive()
      .setScale(botonScale)
      .setDepth(10);

    this.botonDerecha = this.add
      .image(startX + offsetX * 2, startY, "botonDerecha")
      .setInteractive()
      .setScale(botonScale)
      .setDepth(10);

    // Botón de disparo
    this.botonDisparo = this.add
      .image(width * 0.15, height * 0.85, "botonDisparo")
      .setInteractive()
      .setScale(botonDisparoScale)
      .setDepth(10);

    // Movimiento vertical
    this.botonArriba.on("pointerdown", () => {
      this.nave.setVelocityY(-200);
    });

    this.botonArriba.on("pointerout", () => {
      if (this.nave.body.velocity.y < 0) {
        this.nave.setVelocityY(0);
      }
    });

    this.botonArriba.on("pointerup", () => {
      if (this.nave.body.velocity.y < 0) {
        this.nave.setVelocityY(0);
      }
    });

    this.botonAbajo.on("pointerdown", () => {
      this.nave.setVelocityY(200);
    });

    this.botonAbajo.on("pointerout", () => {
      if (this.nave.body.velocity.y > 0) {
        this.nave.setVelocityY(0);
      }
    });

    this.botonAbajo.on("pointerup", () => {
      if (this.nave.body.velocity.y > 0) {
        this.nave.setVelocityY(0);
      }
    });

    // Movimiento horizontal
    this.botonIzquierda.on("pointerdown", () => {
      this.nave.setVelocityX(-200);
    });

    this.botonIzquierda.on("pointerout", () => {
      if (this.nave.body.velocity.x < 0) {
        this.nave.setVelocityX(0);
      }
    });

    this.botonIzquierda.on("pointerup", () => {
      if (this.nave.body.velocity.x < 0) {
        this.nave.setVelocityX(0);
      }
    });

    this.botonDerecha.on("pointerdown", () => {
      this.nave.setVelocityX(200);
    });

    this.botonDerecha.on("pointerout", () => {
      if (this.nave.body.velocity.x > 0) {
        this.nave.setVelocityX(0);
      }
    });

    this.botonDerecha.on("pointerup", () => {
      if (this.nave.body.velocity.x > 0) {
        this.nave.setVelocityX(0);
      }
    });

    // Control de disparo
    let disparoActivo = false;

    this.botonDisparo.on("pointerdown", () => {
      disparoActivo = true;
      this.disparoInterval = this.time.addEvent({
        delay: this.tiempoEsperaDisparo,
        callback: () => {
          if (disparoActivo) {
            this.disparar();
          }
        },
        loop: true,
      });
      // Disparo inicial
      this.disparar();
    });

    this.botonDisparo.on("pointerup", () => {
      disparoActivo = false;
      if (this.disparoInterval) {
        this.disparoInterval.remove();
      }
    });

    this.botonDisparo.on("pointerout", () => {
      disparoActivo = false;
      if (this.disparoInterval) {
        this.disparoInterval.remove();
      }
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
