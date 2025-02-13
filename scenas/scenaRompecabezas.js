class scenaRompecabezas extends Phaser.Scene {
  constructor() {
    super({ key: "scenaRompecabezas" });
  }

  preload() {
    this.load.image("fondo3", "assets/scenaRompecabezas/fondo.png?v=1");
    this.load.image("cabeza", "assets/scenaRompecabezas/cabeza.png");
    this.load.image("izquierda", "assets/scenaRompecabezas/izquierda.png");
    this.load.image("BrazoDerecho", "assets/scenaRompecabezas/derecha.png");
    this.load.image("PieDerecho", "assets/scenaRompecabezas/Pderecho.png");
    this.load.image("PieIzquierdo", "assets/scenaRompecabezas/Pizquierdo.png");
    this.load.image("pecho", "assets/scenaRompecabezas/pecho.png");
    this.load.image("brazos", "assets/scenaRompecabezas/brazos.png");
    this.load.image("brazosI", "assets/scenaRompecabezas/brazoss.png");
    this.load.audio("sonidoCorrecto", "assets/scenaRompecabezas/tornillos.mp3");
    this.load.audio("sonidoIncorrecto", "assets/scenaRompecabezas/error.mp3");
    this.load.image("nivel", "assets/scenaRompecabezas/nivel1.jpg");
  }

  create() {
    const screenWidth = this.scale.width;
    const screenHeight = this.scale.height;

    // Calcular el factor de escala en función del tamaño de la pantalla
    const scaleFactor = Math.min(screenWidth / 800, screenHeight / 600);

    // Ajustar el fondo al tamaño de la pantalla
    const fondo = this.add.image(0, 0, "fondo3").setOrigin(0, 0);
    fondo.displayWidth = screenWidth;
    fondo.displayHeight = screenHeight;

    // Agregar la imagen nivel1.jpg en la esquina superior derecha
    const nivel1Image = this.add.image(screenWidth - 10, 10, "nivel"); // Posición en la esquina superior derecha
    nivel1Image.setOrigin(1, 0); // Ajustar el origen a la esquina superior derecha
    nivel1Image.setScale(0.2 * scaleFactor); // Ajustar la escala en función del factor de escala

    // Texto para mostrar la pieza seleccionada
    this.textoSeleccionado = this.add
      .text(screenWidth / 2, 50, "", {
        fontSize: `${24 * scaleFactor}px`, // Ajustar el tamaño del texto
        fontFamily: "Arial",
        color: "#FFFFFF",
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        padding: { x: 10, y: 5 },
      })
      .setOrigin(0.5)
      .setVisible(false);

    // Definir las posiciones y tamaños de las piezas
    const sizes = {
      pecho: {
        width: 145 * scaleFactor,
        height: 150 * scaleFactor,
        x: screenWidth / 2,
        y: screenHeight / 2.6,
      },
      izquierda: {
        width: 60 * scaleFactor,
        height: 133 * scaleFactor,
        x: screenWidth / 1.67,
        y: screenHeight / 2.1,
      },
      BrazoDerecho: {
        width: 60 * scaleFactor,
        height: 133 * scaleFactor,
        x: screenWidth / 2.5,
        y: screenHeight / 2.1,
      },
      PieIzquierdo: {
        width: 50 * scaleFactor,
        height: 110 * scaleFactor,
        x: screenWidth / 2.1,
        y: screenHeight / 1.57,
      },
      PieDerecho: {
        width: 50 * scaleFactor,
        height: 110 * scaleFactor,
        x: screenWidth / 1.9,
        y: screenHeight / 1.57,
      },
    };

    // Agregar imágenes de brazos
    this.add
      .image(100 * scaleFactor, 210 * scaleFactor, "brazos")
      .setOrigin(0, 0);
    this.add
      .image(700 * scaleFactor, 210 * scaleFactor, "brazosI")
      .setOrigin(0, 0);

    // Crear los objetivos (rectángulos) para cada pieza
    const targets = {};
    Object.keys(sizes).forEach((key) => {
      targets[key] = this.add.rectangle(
        sizes[key].x,
        sizes[key].y,
        sizes[key].width,
        sizes[key].height,
        0xffffff,
        0.3
      );
    });

    // Crear las piezas del rompecabezas
    this.piezas = {};
    Object.keys(sizes).forEach((key) => {
      let pieza = this.add
        .image(
          Phaser.Math.Between(
            100 * scaleFactor,
            screenWidth - 100 * scaleFactor
          ),
          Phaser.Math.Between(
            100 * scaleFactor,
            screenHeight - 100 * scaleFactor
          ),
          key
        )
        .setScale(0.5 * scaleFactor) // Ajustar la escala en función de la resolución
        .setInteractive({ draggable: true });

      this.input.setDraggable(pieza);
      this.piezas[key] = { sprite: pieza, target: targets[key], placed: false };
    });

    // Cargar los sonidos
    this.sonidoCorrecto = this.sound.add("sonidoCorrecto");
    this.sonidoIncorrecto = this.sound.add("sonidoIncorrecto");

    // Evento para iniciar el arrastre
    this.input.on("dragstart", (pointer, gameObject) => {
      let piezaSeleccionada = Object.keys(this.piezas).find(
        (key) => this.piezas[key].sprite === gameObject
      );
      if (piezaSeleccionada) {
        this.textoSeleccionado
          .setText(`Seleccionado: ${piezaSeleccionada}`)
          .setVisible(true);
      }
    });

    // Evento para mover las piezas
    this.input.on("drag", (pointer, gameObject, dragX, dragY) => {
      gameObject.x = Phaser.Math.Clamp(dragX, 0, screenWidth);
      gameObject.y = Phaser.Math.Clamp(dragY, 0, screenHeight);
    });

    // Evento para finalizar el arrastre
    this.input.on("dragend", (pointer, gameObject) => {
      let piezaCorrecta = Object.values(this.piezas).find(
        (p) => p.sprite === gameObject
      );

      if (piezaCorrecta) {
        let target = piezaCorrecta.target;
        let distance = Phaser.Math.Distance.Between(
          gameObject.x,
          gameObject.y,
          target.x,
          target.y
        );

        if (distance < 30 * scaleFactor) {
          // Ajustar la distancia en función de la escala
          gameObject.x = target.x;
          gameObject.y = target.y;
          gameObject.disableInteractive();
          piezaCorrecta.placed = true;
          target.fillColor = 0x00ff00;
          this.sonidoCorrecto.play();
        } else {
          target.fillColor = 0xff0000;
          this.sonidoIncorrecto.play();
        }
      }
      this.textoSeleccionado.setVisible(false);

      // Verificar si todas las piezas están colocadas
      if (Object.values(this.piezas).every((p) => p.placed)) {
        this.completarRompecabezas();
      }
    });
  }

  completarRompecabezas() {
    const screenWidth = this.scale.width;
    const screenHeight = this.scale.height;
    const scaleFactor = Math.min(screenWidth / 800, screenHeight / 600);

    const mensaje = this.add
      .text(
        screenWidth / 2,
        screenHeight / 8,
        "¡Felicidades! Completaste el rompecabezas",
        {
          fontSize: `${32 * scaleFactor}px`,
          fontFamily: "Arial",
          color: "#FFFFFF",
          backgroundColor: "transparent",
          padding: { x: 15, y: 10 },
        }
      )
      .setOrigin(0.5);

    this.time.delayedCall(5000, () => {
      this.scene.start("scenaJuego");
      this.sound.stopAll();
    });
  }
}
