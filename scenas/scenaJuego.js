class scenaJuego extends Phaser.Scene {
  constructor() {
    super({ key: "scenaJuego" });
    this.puedeDisparar = true;
    this.tiempoEsperaDisparo = 300;
    this.score = 0;
    this.vida = 100;
    this.isMobile = false;
    this.jefeFinal = null; // Variable para el jefe final
    this.balasJefe = 3; // Grupo de balas del jefe
    this.eventos = [];
    this.disparoJefeEvento = null; // Evento para los disparos del jefe
    this.timerAtaqueJefe = null; // Nueva variable para controlar el timer
    this.jefeFinalActivo = false; // Estado del jefe final
    this.vidaJefeFinal = 1000; // Vida del jefe final
    this.tiempoAtaqueJefe = 900; // Tiempo entre ataques del jefe
    this.jefeFinalVelocidad = 2; // Velocidad de movimiento del jefe final
  }

  preload() {
    // Cargar recursos (imágenes, sonidos, etc.)
    this.load.image("background", "assets/scenaJuego/fondo.png");
    this.load.image("planetas", "assets/scenaJuego/planetas.png");
    this.load.image("nave", "assets/scenaJuego/nave.png");
    this.load.image("GranPlaneta", "assets/scenaJuego/GranPlaneta.png");
    this.load.image("GranPlaneta2", "assets/scenaJuego/GranPlaneta2.png");
    this.load.image("estrellas", "assets/scenaJuego/estrellas.png");
    this.load.image("fondo1", "assets/scenaJuego/a.jpg");
    this.load.image("bala", "assets/scenaJuego/bala.png");
    this.load.image("nivel", "assets/scenaJuego/nivel1.jpg");
    this.load.image("enemigo", "assets/scenaJuego/enemigo.png");
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

    // Jefe Final
    this.load.image("jefeFinal", "assets/scenaJuego/jefeFinal.png");
    this.load.image("balaJefe", "assets/scenaJuego/bala.png");
    this.load.audio(
      "sonidoImpactoJefe",
      "assets/scenaJuego/sonidoImpactoJefe.mp3"
    );
  }

  create() {
    // Verificar que this.resize sea una función antes de agregar el listener
    if (typeof this.resize === "function") {
      this.scale.on("resize", this.resize.bind(this), this);
    } else {
      console.error("this.resize no es una función");
    }

    this.isMobile =
      this.sys.game.device.os.android || this.sys.game.device.os.iOS;

    // Esperar un frame para asegurarse de que las dimensiones estén correctas
    this.time.delayedCall(1, () => {
      this.initializeGame();
    });

    // Crear la nave
    this.nave = this.physics.add.sprite(200, 300, "nave").setScale(0.3);
    this.nave.setCollideWorldBounds(true);

    // Ajustar el tamaño del cuerpo físico de la nave
    this.nave.setSize(40, 40).setOffset(10, 10);

    this.nave.setOffset(this.nave.width * 0.25, this.nave.height * 0.25);

    // Crear el grupo de balas del jefe
    this.balasJefe = this.physics.add.group({
      defaultKey: "balaJefe",
      maxSize: 30,
      allowGravity: false,
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

  initializeGame() {
    const { width, height } = this.scale.displaySize;

    // Calcular el DPR (Device Pixel Ratio)
    this.dpr = window.devicePixelRatio || 1; // Si no está disponible, usa 1 como valor predeterminado

    // Ajustar el fondo para que ocupe toda la pantalla
    this.fondo = this.add.image(0, 0, "fondo1").setOrigin(0, 0);
    this.fondo.setScale(
      this.scale.width / this.fondo.width,
      this.scale.height / this.fondo.height
    );

    // Añadir barra de vida del jefe final
    this.barraVidaJefe = this.add.graphics();
    this.barraVidaJefe.setVisible(false); // Inicialmente oculta

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
    this.nave = this.physics.add.sprite(200, 300, "nave").setScale(0.3);
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
    this.eventos = [
      this.time.addEvent({
        delay: 1000,
        callback: this.generarEnemigo,
        callbackScope: this,
        loop: true,
      }),
    ];

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

  crearJefeFinal() {
    if (!this.jefeFinalActivo) {
      this.jefeFinalActivo = true;

      // Crear el jefe final
      this.jefeFinal = this.physics.add.sprite(
        this.scale.width - 100,
        this.scale.height / 2,
        "jefeFinal"
      );
      this.jefeFinal.setScale(1);
      this.jefeFinal.setCollideWorldBounds(true);
      this.jefeFinal.setBounce(1);
      this.jefeFinal.setImmovable(true);
      this.jefeFinal.setVelocityY(100); // Velocidad inicial

      // Crear el grupo de balas del jefe si no existe
      if (!this.balasJefe) {
        this.balasJefe = this.physics.add.group({
          defaultKey: "balaJefe",
          maxSize: 30,
          allowGravity: false,
        });
      }

      // Configurar colisiones entre balas del jefe y la nave
      this.physics.add.overlap(
        this.balasJefe,
        this.nave,
        (nave, bala) => {
          console.log(" Bala impactó en la nave!");
          bala.destroy();
          this.naveParpadea();
          this.vida -= 10;
          this.actualizarBarraVida();
          if (this.vida <= 0) {
            this.gameOver();
          }
        },
        null,
        this
      );

      // Mostrar barra de vida del jefe
      this.barraVidaJefe = this.add.graphics();
      this.barraVidaJefe.setVisible(true); // Hacer visible la barra de vida
      this.actualizarBarraVidaJefe(); // Dibujar la barra de vida

      // Iniciar patrón de ataque del jefe con un temporizador controlado
      this.timerAtaqueJefe = this.time.addEvent({
        delay: this.tiempoAtaqueJefe, // Frecuencia de disparo
        callback: this.ataqueJefeFinal,
        callbackScope: this,
        loop: true,
      });
      // Colisión entre balas y jefe final
      this.physics.add.collider(this.balas, this.jefeFinal, (jefe, bala) => {
        bala.destroy();
        this.vidaJefeFinal -= 20;
        this.actualizarBarraVidaJefe();

        this.sound.play("sonidoImpactoJefe", {
          volume: 1,
          loop: false,
          detune: 0,
        });

        // Efecto visual de daño
        this.jefeFinal.setTint(0xff0000);
        this.time.delayedCall(100, () => {
          if (this.jefeFinal && this.jefeFinal.active) {
            this.jefeFinal.clearTint();
          }
        });

        if (this.vidaJefeFinal <= 0) {
          this.derrotarJefeFinal();
        }
      });
    }
  }

  actualizarBarraVidaJefe() {
    const { width, height } = this.scale.displaySize;

    // Limpiar la barra de vida antes de redibujarla
    this.barraVidaJefe.clear();

    // Dibujar el fondo de la barra de vida (opcional)
    this.barraVidaJefe.fillStyle(0x000000, 1); // Color negro de fondo
    this.barraVidaJefe.fillRect(
      this.jefeFinal.x - 100,
      this.jefeFinal.y + 60,
      200,
      20
    ); // Fondo de la barra

    // Dibujar la barra de vida (roja)
    this.barraVidaJefe.fillStyle(0xff0000, 1); // Color rojo
    this.barraVidaJefe.fillRect(
      this.jefeFinal.x - 100,
      this.jefeFinal.y + 60,
      (this.vidaJefeFinal / 1000) * 200, // Ancho proporcional a la vida
      20
    );

    // Dibujar el borde de la barra de vida (opcional)
    this.barraVidaJefe.lineStyle(2, 0xffffff); // Borde blanco
    this.barraVidaJefe.strokeRect(
      this.jefeFinal.x - 100,
      this.jefeFinal.y + 60,
      200,
      20
    );
    this.barraVidaJefe.setDepth(1000); // Asegurar que esté en la capa superior
  }

  ataqueJefeFinal() {
    if (this.jefeFinal && this.jefeFinal.active && this.jefeFinalActivo) {
      const naveX = this.nave.x;
      const naveY = this.nave.y;
      const jefeX = this.jefeFinal.x;
      const jefeY = this.jefeFinal.y;

      const angle = Phaser.Math.Angle.Between(jefeX, jefeY, naveX, naveY);
      const bala = this.balasJefe.create(jefeX, jefeY, "balaJefe");

      if (bala) {
        bala.setActive(true);
        bala.setVisible(true);
        bala.setTint(0xff0000); // Color rojo para distinguirlas
        bala.setVelocity(Math.cos(angle) * 200, Math.sin(angle) * 100);
        bala.body.setAllowGravity(false); // Desactivar gravedad
        bala.setCollideWorldBounds(false); // No limitar a los bordes

        // Asegurar que el cuerpo de la bala sea detectado en colisiones
        bala.body.setSize(20, 20); // Ajusta el tamaño del cuerpo físico
        bala.body.setOffset(4, 4); // Ajusta el offset si es necesario
        bala.body.setImmovable(false);
        bala.body.setBounce(0);

        // Destruir la bala si no impacta en 3 segundos
        this.time.delayedCall(6000, () => {
          if (bala && bala.active) {
            bala.destroy();
          }
        });
      }
    }
  }

  derrotarJefeFinal() {
    if (!this.jefeFinal || !this.jefeFinal.active) return;

    // Detener el timer de ataque antes de destruir al jefe
    if (this.timerAtaqueJefe) {
      this.timerAtaqueJefe.remove();
      this.timerAtaqueJefe = null;
    }

    // Limpiar todas las balas del jefe
    this.balasJefe.clear(true, true);

    // Efecto de explosión
    this.jefeFinal.setTint(0xff0000);
    this.sonidoExplosion.play();

    this.time.delayedCall(100, () => {
      if (this.jefeFinal && this.jefeFinal.active) {
        this.jefeFinal.destroy();
      }
      if (this.barraVidaJefe) {
        this.barraVidaJefe.setVisible(false);
      }
      this.score += 500;
      this.scoreText.setText(`Score: ${this.score}`);
      this.jefeFinalActivo = false;

      // Pausar el juego
      this.physics.pause();

      // Mostrar mensaje de victoria
      const victoriaText = this.add
        .text(this.scale.width / 2, this.scale.height / 2, "¡Jefe Derrotado!", {
          fontSize: "48px",
          fill: "#fff",
          stroke: "#000",
          strokeThickness: 6,
        })
        .setOrigin(0.5);

      // Botón de continuar
      const continuarBtn = this.add
        .text(this.scale.width / 2, this.scale.height / 2 + 60, "", {
          fontSize: "36px",
          fill: "#fff",
          stroke: "#000",
          strokeThickness: 4,
        })
        .setOrigin(0.5)
        .setInteractive();

      // Animación de parpadeo para el botón de continuar
      this.tweens.add({
        targets: continuarBtn,
        alpha: 0,
        duration: 500,
        yoyo: true,
        repeat: -1,
      });

      // Evento del botón de continuar
      continuarBtn.on("pointerdown", () => {
        this.physics.resume(); // Reanudar el juego
        victoriaText.destroy();
        continuarBtn.destroy();

        // Reiniciar la generación de enemigos
        this.eventos = [
          this.time.addEvent({
            delay: 2000,
            callback: this.generarEnemigo,
            callbackScope: this,
            loop: true,
          }),
        ];
      });
    });
  }

  addMobileControls() {
    const { width, height } = this.scale.displaySize;

    // Factor de escala reducido para que los botones no sean tan grandes
    const botonScale = Math.min(width, height) * 0.009;
    const botonDisparoScale = botonScale * 1.6;

    // Posiciones para los controles:
    // - Los botones de movimiento se ubicarán en el lado derecho.
    // - El botón de disparo se ubicará en el lado izquierdo.
    const offsetMovement = width * 0.13;
    const movementStartX = width * 1; // Lado derecho
    const movementStartY = height * 0.9;

    const shootX = width * 0.15; // Lado izquierdo
    const shootY = height * 0.8;

    this.input.addPointer(3); // Permite hasta 3 toques simultáneos

    // Botones de movimiento (lado derecho)
    this.botonArriba = this.add
      .image(movementStartX, movementStartY - offsetMovement, "botonArriba")
      .setInteractive()
      .setScale(botonScale)
      .setDepth(10);

    this.botonAbajo = this.add
      .image(movementStartX, movementStartY + offsetMovement, "botonAbajo")
      .setInteractive()
      .setScale(botonScale)
      .setDepth(10);

    this.botonIzquierda = this.add
      .image(movementStartX - offsetMovement, movementStartY, "botonIzquierda")
      .setInteractive()
      .setScale(botonScale)
      .setDepth(10);

    this.botonDerecha = this.add
      .image(movementStartX + offsetMovement, movementStartY, "botonDerecha")
      .setInteractive()
      .setScale(botonScale)
      .setDepth(10);

    // Botón de disparo (lado izquierdo)
    this.botonDisparo = this.add
      .image(shootX, shootY, "botonDisparo")
      .setInteractive()
      .setScale(botonDisparoScale)
      .setDepth(10);

    // Eventos para movimiento vertical
    this.botonArriba.on("pointerdown", () => {
      this.nave.setVelocityY(-200);
    });
    this.botonArriba.on("pointerup", () => {
      if (this.nave.body.velocity.y < 0) this.nave.setVelocityY(0);
    });

    this.botonAbajo.on("pointerdown", () => {
      this.nave.setVelocityY(200);
    });
    this.botonAbajo.on("pointerup", () => {
      if (this.nave.body.velocity.y > 0) this.nave.setVelocityY(0);
    });

    // Eventos para movimiento horizontal
    this.botonIzquierda.on("pointerdown", () => {
      this.nave.setVelocityX(-200);
    });
    this.botonIzquierda.on("pointerup", () => {
      if (this.nave.body.velocity.x < 0) this.nave.setVelocityX(0);
    });

    this.botonDerecha.on("pointerdown", () => {
      this.nave.setVelocityX(200);
    });
    this.botonDerecha.on("pointerup", () => {
      if (this.nave.body.velocity.x > 0) this.nave.setVelocityX(0);
    });

    // Control de disparo
    let disparoActivo = false;

    this.botonDisparo.on("pointerdown", () => {
      disparoActivo = true;
      this.disparoInterval = this.time.addEvent({
        delay: this.tiempoEsperaDisparo,
        callback: () => {
          if (disparoActivo) this.disparar();
        },
        loop: true,
      });
      // Disparo inicial
      this.disparar();
    });

    this.botonDisparo.on("pointerup", () => {
      disparoActivo = false;
      if (this.disparoInterval) this.disparoInterval.remove();
    });

    this.botonDisparo.on("pointerout", () => {
      disparoActivo = false;
      if (this.disparoInterval) this.disparoInterval.remove();
    });
  }

  actualizarBarraVida() {
    this.barraVida.clear(); // Limpiar la barra de vida anterior
    this.barraVida.fillStyle(0xff0000, 1); // Color rojo
    this.barraVida.fillRect(16, 60, this.vida, 20); // Dibujar la barra de vida
  }

  gameOver() {
    if (this.timerAtaqueJefe) {
      this.timerAtaqueJefe.remove();
      this.timerAtaqueJefe = null;
    }

    this.musicaJuego.stop();
    this.sonidoGameOver.play();

    // Pausar solo la física del juego en lugar de toda la escena
    this.physics.pause();

    // Detener el movimiento de la nave y enemigos
    this.nave.setVelocity(0, 0);
    this.enemigos.children.each((enemigo) => {
      enemigo.setVelocity(0, 0);
      enemigo.anims.pause();
    });

    // Detener la generación de enemigos
    if (this.eventos) {
      this.eventos.forEach((evento) => evento.remove());
      this.eventos = [];
    }

    // Variable para controlar la pausa del fondo
    this.isGameOver = true;

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
      .setOrigin(0.5)
      .setDepth(1000);

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
      .setInteractive()
      .setDepth(1000);

    // Animación de parpadeo para el botón de reinicio
    this.tweens.add({
      targets: reiniciarBtn,
      alpha: 0,
      duration: 500,
      yoyo: true,
      repeat: -1,
    });

    // Hacer el botón interactivo
    reiniciarBtn.setInteractive({ useHandCursor: true });

    // Evento del botón de reinicio
    reiniciarBtn.on("pointerdown", () => {
      this.reiniciarJuego();
    });
  }

  reiniciarJuego() {
    // Resetear variables del jefe final
    this.jefeFinalActivo = false;
    this.vidaJefeFinal = 1000;
    if (this.jefeFinal) {
      this.jefeFinal.destroy();
    }
    if (this.timerAtaqueJefe) {
      this.timerAtaqueJefe.remove();
      this.timerAtaqueJefe = null;
    }
    this.balasJefe.clear(true, true);
    this.barraVidaJefe?.setVisible(false);

    // Resto del código de reiniciarJuego...
    this.isGameOver = false;
    this.physics.resume();

    // Quitar el estado de game over
    this.isGameOver = false;

    // Reanudar la física del juego
    this.physics.resume();

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
    if (!this.jefeFinalActivo) {
      const x = this.scale.width + 50;
      const y = Phaser.Math.Between(50, this.scale.height - 50);

      const enemigo = this.enemigos.create(x, y, "enemigo");
      enemigo.setScale(0.5);
      enemigo.setVelocityX(-100);
      enemigo.anims.play("enemigoAnim");

      // Eliminar el enemigo cuando sale de la pantalla
      enemigo.setCollideWorldBounds(false);
      enemigo.checkWorldBounds = true;
      enemigo.outOfBoundsKill = true;
    }
  }

  disparar() {
    if (this.puedeDisparar) {
      const bala = this.balas.get(this.nave.x + 40, this.nave.y + 0);
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
    this.nave.setAlpha(0.5); // Hacer la nave semi-transparente
    this.time.delayedCall(100, () => {
      this.nave.setAlpha(1); // Restaurar la opacidad de la nave
    });
  }

  update() {
    if (!this.isGameOver && !this.physics.world.isPaused) {
      // Verificar si se alcanzó la puntuación para el jefe final
      if (this.score >= 100 && !this.jefeFinalActivo) {
        this.crearJefeFinal();
      }

      // Mover el jefe final
      if (this.jefeFinal && this.jefeFinal.active && this.jefeFinalActivo) {
        // Cambiar la dirección cuando llega a los límites
        if (this.jefeFinal.y <= 100) {
          this.jefeFinal.setVelocityY(150);
        } else if (this.jefeFinal.y >= this.scale.height - 100) {
          this.jefeFinal.setVelocityY(-150);
        }

        // Actualizar la barra de vida del jefe
        if (this.barraVidaJefe) {
          this.actualizarBarraVidaJefe();
        }
      }

      // Limpiar balas fuera de pantalla
      if (this.balasJefe && this.balasJefe.children) {
        this.balasJefe.children.each((bala) => {
          if (bala.active) {
            if (
              bala.x < -50 ||
              bala.x > this.scale.width + 50 ||
              bala.y < -50 ||
              bala.y > this.scale.height + 50
            ) {
              bala.destroy();
            }
          }
        });
      }

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
}
