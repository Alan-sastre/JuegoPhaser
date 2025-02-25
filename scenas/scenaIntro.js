class scenaIntro extends Phaser.Scene {
  constructor() {
    super({ key: "scenaIntro" });
  }

  preload() {
    this.load.image("fondo2", "assets/scenaIntro/fondo.png");
    this.load.image("capitan", "assets/scenaIntro/capitanRobo.png");
    this.load.audio("teclado", "assets/scenaIntro/teclado.mp3");
    this.load.image("nivel", "assets/scenaIntro/nivel1.jpg");
    this.load.audio("musica", "assets/scenaIntro/musicaSpaceLoop.mp3");
  }

  create() {
    const { width, height } = this.scale.displaySize;
    const fondo = this.add.image(0, 0, "fondo2");
    fondo.setOrigin(0, 0);
    fondo.displayWidth = this.scale.width;
    fondo.displayHeight = this.scale.height;

    const capitan = this.add.image(
      this.scale.width * 0.8,
      this.scale.height * 0.7,
      "capitan"
    );
    capitan.setScale(0.8);
    capitan.setOrigin(0.5, 0.5);

    const music = this.sound.add("musica", { loop: true, volume: 0.2 });
    this.musicaFondo.play();


    const nivel1Image = this.add.image(width - 100, 30, "nivel");
    nivel1Image.setOrigin(0.5);
    nivel1Image.setScale(0.2);

    this.scale.on("resize", (gameSize) => {
      const newWidth = gameSize.width;
      nivel1Image.x = newWidth + 100;
    });

    this.dialogues = [
      "!Antes de comenzar el nivel, los jugadores recibirán una breve explicación interactiva sobre los conceptos básicos de robótica y programación:",
      "¿Qué es un robot? \n \n Un robot es una máquina programable diseñada para realizar tareas automáticamente. Puede percibir su entorno (sensores), procesar información (controladores) y actuar (motores y actuadores).",
      "¿Qué es la programación? \n \n La programación es el proceso de crear instrucciones para que un robot o dispositivo ejecute tareas específicas. Los comandos deben ser claros y lógicos para evitar errores.",
      "Pregunta: ¿Cuál de estas partes es esencial para que un robot funcione correctamente?",
    ];

    this.currentDialogueIndex = 0;
    this.showNextDialogue();
  }





  showNextDialogue() {
    if (this.currentDialogueIndex < this.dialogues.length) {
      const currentText = this.dialogues[this.currentDialogueIndex];

      if (currentText.startsWith("Pregunta:")) {
        this.showQuestionWithBoxes(currentText);
      } else {
        const { dialogBox, dialogText, continueText } = this.showDialog(
          this,
          "",
          50,
          200,
          600,
          150
        );

        let currentCharIndex = 0;
        const typingSound = this.sound.add("teclado");
        typingSound.play({ loop: true, volume: 0.5 });

        const typingAnimation = this.time.addEvent({
          delay: 50,
          callback: () => {
            dialogText.text += currentText[currentCharIndex];
            currentCharIndex++;

            if (currentCharIndex >= currentText.length) {
              typingAnimation.remove();
              typingSound.stop();
              continueText.setText("Da click para continuar");

              this.input.once("pointerdown", () => {
                this.currentDialogueIndex++;
                this.closeDialog(dialogBox, dialogText, continueText);
                this.showNextDialogue();
              });
            }
          },
          loop: true,
        });
      }
    } else {
      this.scene.start("game");
    }
  }

  showQuestionWithBoxes(questionText) {
    const question = questionText.split(":")[1].trim();

    const questionBox = this.add.graphics();
    questionBox.fillStyle(0x000000, 0.8);
    questionBox.fillRoundedRect(50, 150, 600, 100, 15);

    const questionTextDisplay = this.add.text(60, 160, question, {
      fontSize: "20px",
      fill: "#ffffff",
      wordWrap: { width: 580 },
    });

    const options = [
      {
        text: "Sensores",
        feedback:
          "Correcto. Los sensores permiten al robot percibir su entorno.",
        isCorrect: true,
      },
      {
        text: "Ruedas",
        feedback:
          "Incorrecto. Aunque importantes, no todos los robots tienen ruedas.",
        isCorrect: false,
      },
      {
        text: "Pantalla LCD",
        feedback:
          "Incorrecto. Las pantallas no son esenciales para que el robot funcione.",
        isCorrect: false,
      },
      {
        text: "Altavoces",
        feedback:
          "Incorrecto. Los altavoces son accesorios, no una parte esencial.",
        isCorrect: false,
      },
      {
        text: "Circuitos eléctricos",
        feedback:
          "Correcto. Sin circuitos eléctricos, el robot no podría procesar ni ejecutar tareas.",
        isCorrect: true,
      },
    ];

    this.correctAnswersSelected = 0;
    this.selectedCorrectOptions = [];

    const optionBoxes = [];
    const startY = 300;
    const boxWidth = 250;
    const boxHeight = 50;
    const spacing = 20;
    const columnSpacing = 50;

    options.forEach((option, index) => {
      const column = index % 2 === 0 ? 0 : 1;
      const row = Math.floor(index / 2);

      const boxX =
        column === 0
          ? this.scale.width / 2 - boxWidth - columnSpacing
          : this.scale.width / 2 + columnSpacing;

      const boxY = startY + row * (boxHeight + spacing);

      const optionBox = this.add.graphics();
      optionBox.fillStyle(0x000000, 0.8);
      optionBox.fillRoundedRect(boxX, boxY, boxWidth, boxHeight, 10);

      optionBox.lineStyle(2, 0xffffff, 1);
      optionBox.strokeRoundedRect(boxX, boxY, boxWidth, boxHeight, 10);

      optionBox.setInteractive(
        new Phaser.Geom.Rectangle(boxX, boxY, boxWidth, boxHeight),
        Phaser.Geom.Rectangle.Contains
      );

      const optionText = this.add.text(boxX + 10, boxY + 15, option.text, {
        fontSize: "16px",
        fill: "#ffffff",
        wordWrap: { width: boxWidth - 20 },
        align: "center",
      });

      optionBox.on("pointerdown", () => {
        this.handleOptionSelection(
          option.isCorrect,
          option.feedback,
          optionBox,
          optionText,
          questionBox,
          questionTextDisplay,
          optionBoxes
        );
      });

      optionBoxes.push({ optionBox, optionText });
    });
  }

  handleOptionSelection(
    isCorrect,
    feedback,
    optionBox,
    optionText,
    questionBox,
    questionTextDisplay,
    optionBoxes
  ) {
    if (isCorrect) {
      if (!this.selectedCorrectOptions.includes(optionText.text)) {
        this.selectedCorrectOptions.push(optionText.text);
        this.correctAnswersSelected++;

        optionBox.clear();
        optionBox.fillStyle(0x28a745, 1);
        optionBox.fillRoundedRect(
          optionText.x - 10,
          optionText.y - 15,
          250,
          50,
          10
        );

        if (this.correctAnswersSelected === 2) {
          this.showCongratulations();
          this.time.delayedCall(2600, () => {
            questionBox.destroy();
            questionTextDisplay.destroy();
            optionBoxes.forEach(({ optionBox, optionText }) => {
              optionBox.destroy();
              optionText.destroy();
            });
            this.showFeedbackText();
          });
        }
      }
    } else {
      optionBox.clear();
      optionBox.fillStyle(0xdc3545, 1);
      optionBox.fillRoundedRect(
        optionText.x - 10,
        optionText.y - 15,
        250,
        50,
        10
      );

      this.showAlert(feedback, 0xdc3545);
    }
  }

  showCongratulations() {
    const congratsText = this.add.text(
      this.scale.width / 2,
      100,
      "¡Lo hiciste muy bien!",
      {
        fontSize: "30px",
        fill: "#28a745",
        fontStyle: "bold",
      }
    );
    congratsText.setOrigin(0.5, 0.5);

    this.time.delayedCall(2000, () => {
      congratsText.destroy();
    });
  }

  showFeedbackText() {
    const feedbackText =
      "Retroalimentación:\n“Recuerda, los sensores y los circuitos eléctricos son elementos clave para que un robot pueda interactuar con su entorno y funcionar correctamente.”";

    const { dialogBox, dialogText, continueText } = this.showDialog(
      this,
      "",
      50,
      200,
      600,
      150
    );

    let currentCharIndex = 0;
    const typingSound = this.sound.add("teclado");
    typingSound.play({ loop: true, volume: 0.5 });

    const typingAnimation = this.time.addEvent({
      delay: 50,
      callback: () => {
        dialogText.text += feedbackText[currentCharIndex];
        currentCharIndex++;

        if (currentCharIndex >= feedbackText.length) {
          typingAnimation.remove();
          typingSound.stop();
          continueText.setText("Da click para continuar");

          this.input.once("pointerdown", () => {
            this.closeDialog(dialogBox, dialogText, continueText);
            this.scene.start("scenaRompecabezas");
          });
        }
      },
      loop: true,
    });
  }

  showAlert(message, color) {
    const alertBox = this.add.graphics();
    alertBox.fillStyle(color, 0.8);
    alertBox.fillRoundedRect(100, 50, 600, 50, 15);

    const alertText = this.add.text(110, 60, message, {
      fontSize: "18px",
      fill: "#ffffff",
      wordWrap: { width: 580 },
    });

    this.time.delayedCall(2000, () => {
      alertBox.destroy();
      alertText.destroy();
    });
  }

  showDialog(scene, text, x, y, width, height) {
    const dialogBox = scene.add.graphics();
    dialogBox.fillStyle(0x000000, 0.8);
    dialogBox.fillRoundedRect(x, y, width, height, 15);

    const dialogText = scene.add.text(x + 10, y + 10, text, {
      fontSize: "20px",
      fill: "#ffffff",
      wordWrap: { width: width - 20 },
    });

    const continueText = scene.add.text(
      x + width / 2 - 80,
      y + height + 10,
      "",
      {
        fontSize: "30px",
        fill: "#ffffff",

      }
    );

    continueText.setShadow(6, 6, "black", 2, true, true);

    scene.tweens.add({
  targets: continueText,
  alpha: 0,         // Desvanece el texto
  duration: 500,    // Duración en milisegundos (0.5 segundos)
  yoyo: true,       // Hace que el efecto se invierta (volver a aparecer)
  repeat: -1        // Repetir infinitamente
});

    return { dialogBox, dialogText, continueText };
  }

  closeDialog(dialogBox, dialogText, continueText) {
    dialogBox.destroy();
    dialogText.destroy();
    continueText.destroy();
  }

  update() {}
}
