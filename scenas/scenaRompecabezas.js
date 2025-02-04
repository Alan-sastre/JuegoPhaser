class scenaRompecabezas extends Phaser.Scene {
  constructor() {
    super({ key: "scenaRompecabezas" });
  }

  preload() {
    this.load.image("fondo", "assets/scenaRompecabezas/fondo.png");
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
  }

  create() {
    const screenWidth = this.scale.width;
    const screenHeight = this.scale.height;
    const fondo = this.add.image(0, 0, "fondo").setOrigin(0, 0);
    fondo.displayWidth = screenWidth;
    fondo.displayHeight = screenHeight;

    this.textoSeleccionado = this.add
      .text(screenWidth / 2, 50, "", {
        fontSize: "24px",
        fontFamily: "Arial",
        color: "#FFFFFF",
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        padding: { x: 10, y: 5 },
      })
      .setOrigin(0.5)
      .setVisible(false);

    const sizes = {
      pecho: {
        width: 145,
        height: 150,
        x: screenWidth / 2,
        y: screenHeight / 2.6,
      },
      izquierda: {
        width: 60,
        height: 133,
        x: screenWidth / 1.67,
        y: screenHeight / 2.1,
      },
      BrazoDerecho: {
        width: 60,
        height: 133,
        x: screenWidth / 2.5,
        y: screenHeight / 2.1,
      },
      PieIzquierdo: {
        width: 50,
        height: 110,
        x: screenWidth / 2.1,
        y: screenHeight / 1.57,
      },
      PieDerecho: {
        width: 50,
        height: 110,
        x: screenWidth / 1.9,
        y: screenHeight / 1.57,
      },
    };

    this.add.image(100, 210, "brazos").setOrigin(0, 0);
    this.add.image(700, 210, "brazosI").setOrigin(0, 0);

    const targets = {};
    Object.keys(sizes).forEach((key) => {
      targets[key] = this.add
        .rectangle(
          sizes[key].x,
          sizes[key].y,
          sizes[key].width,
          sizes[key].height,
          0xffffff,
          0.3
        )
        .setStrokeStyle(2, 0x0000ff);
    });

    this.piezas = {};
    Object.keys(sizes).forEach((key) => {
      let pieza = this.add
        .image(
          Phaser.Math.Between(100, screenWidth - 100),
          Phaser.Math.Between(100, screenHeight - 100),
          key
        )
        .setScale(0.5)
        .setInteractive({ draggable: true });

      pieza.setShadow(4, 4, "#000000", 8);

      this.input.setDraggable(pieza);
      this.piezas[key] = { sprite: pieza, target: targets[key], placed: false };
    });

    this.sonidoCorrecto = this.sound.add("sonidoCorrecto");
    this.sonidoIncorrecto = this.sound.add("sonidoIncorrecto");

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

    this.input.on("drag", (pointer, gameObject, dragX, dragY) => {
      gameObject.x = Phaser.Math.Clamp(dragX, 0, screenWidth);
      gameObject.y = Phaser.Math.Clamp(dragY, 0, screenHeight);
    });

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

        if (distance < 30) {
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

      if (Object.values(this.piezas).every((p) => p.placed)) {
        this.completarRompecabezas();
      }
    });
  }

  completarRompecabezas() {
    const mensaje = this.add
      .text(
        this.scale.width / 2,
        this.scale.height / 8,
        "¡Felicidades! Completaste el rompecabezas ",
        {
          fontSize: "32px",
          fontFamily: "Arial",
          color: "#FFFFFF",
          backgroundColor: "transparent",
          padding: { x: 15, y: 10 },
        }
      )
      .setOrigin(0.5);

    this.time.delayedCall(4000, () => {
      this.scene.start("siguienteEscena");
    });
  }
}
