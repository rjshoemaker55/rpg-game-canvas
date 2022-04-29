class Overworld {
  constructor(config) {
    this.element = config.element;
    this.canvas = this.element.querySelector('.game-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.map = null;
  }

  startGameLoop() {
    const step = () => {
      // clear canvas
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      // Establish the camera person
      const cameraPerson = this.map.gameObjects.hero;

      // update all objects
      Object.values(this.map.gameObjects).forEach((object) => {
        object.update({
          arrow: this.directionInput.direction,
          map: this.map
        });
      });

      // Draw lower layer
      this.map.drawLowerImage(this.ctx, cameraPerson);

      // Draw game objects
      Object.values(this.map.gameObjects)
        .sort((a, b) => a.y - b.y)
        .forEach((object) => {
          object.sprite.draw(this.ctx, cameraPerson);
        });

      // Draw upper layer
      this.map.drawUpperImage(this.ctx, cameraPerson);

      requestAnimationFrame(() => {
        step();
      });
    };
    step();
  }

  bindActionInput() {
    new KeyPressListener('Enter', () => {
      this.map.checkForActionCutscene();
    });
  }

  init() {
    this.map = new OverworldMap(window.OverworldMaps.DemoRoom);
    this.map.mountObjects();

    this.bindActionInput();

    this.directionInput = new DirectionInput();
    this.directionInput.init();

    this.startGameLoop();

    // this.map.startCutscene([
    //   { who: 'hero', type: 'walk', direction: 'up' },
    //   { who: 'hero', type: 'walk', direction: 'right' },
    //   { who: 'hero', type: 'walk', direction: 'right' },
    //   { who: 'hero', type: 'walk', direction: 'right' },
    //   { who: 'hero', type: 'walk', direction: 'right' },
    //   { who: 'hero', type: 'walk', direction: 'up' },
    //   { who: 'hero', type: 'walk', direction: 'right' },
    //   { who: 'hero', type: 'stand', direction: 'down', time: 800 },
    //   { who: 'npcA', type: 'walk', direction: 'right' },
    //   { who: 'npcA', type: 'walk', direction: 'right' },
    //   { who: 'npcA', type: 'walk', direction: 'right' },
    //   { who: 'npcA', type: 'walk', direction: 'up' },
    //   { who: 'npcA', type: 'walk', direction: 'up' },
    //   { who: 'npcA', type: 'walk', direction: 'up' },
    //   { who: 'npcA', type: 'walk', direction: 'up' },
    //   { type: 'textMessage', text: 'Welcome to Pizza Legends!' },
    //   { who: 'npcA', type: 'walk', direction: 'down' },
    //   { who: 'npcA', type: 'walk', direction: 'down' },
    //   { who: 'npcA', type: 'walk', direction: 'down' },
    //   { who: 'npcA', type: 'walk', direction: 'down' },
    //   { who: 'npcA', type: 'walk', direction: 'left' },
    //   { who: 'npcA', type: 'walk', direction: 'left' },
    //   { who: 'npcA', type: 'walk', direction: 'left' }
    // ]);
  }
}
