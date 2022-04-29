class OverworldMap {
  constructor(config) {
    this.gameObjects = config.gameObjects;
    this.walls = config.walls || {};

    this.lowerImage = new Image();
    this.lowerImage.src = config.lowerSrc;

    this.upperImage = new Image();
    this.upperImage.src = config.upperSrc;

    this.isCutscenePlaying = false;
  }

  // Draw lower layer of map to canvas
  drawLowerImage(ctx, cameraPerson) {
    ctx.drawImage(
      this.lowerImage,
      utils.withGrid(10.5) - cameraPerson.x,
      utils.withGrid(6) - cameraPerson.y
    );
  }

  // Draw upper layer of map to canvas
  drawUpperImage(ctx, cameraPerson) {
    ctx.drawImage(
      this.upperImage,
      utils.withGrid(10.5) - cameraPerson.x,
      utils.withGrid(6) - cameraPerson.y
    );
  }

  // return whether or not there is a wall in the space the object is trying to move to
  isSpaceTaken(currentX, currentY, direction) {
    const { x, y } = utils.nextPosition(currentX, currentY, direction);

    // if there is a wall, return true. else, return false
    return this.walls[`${x},${y}`] || false;
  }

  // iterate through the game objects, and run mount on each one, passing this map
  mountObjects() {
    Object.keys(this.gameObjects).forEach((key) => {
      // get the game object
      let object = this.gameObjects[key];

      // set key to the id of the game object
      object.id = key;

      // mount the game object
      object.mount(this);
    });
  }

  // add a wall to this map in the passed coordinates
  addWall(x, y) {
    this.walls[`${x},${y}`] = true;
  }

  // remove the wall from this map in the passed coordinates
  removeWall(x, y) {
    delete this.walls[`${x},${y}`];
  }

  // move the wall from the past coordinates to the object's next location
  moveWall(wasX, wasY, direction) {
    this.removeWall(wasX, wasY);
    const { x, y } = utils.nextPosition(wasX, wasY, direction);
    this.addWall(x, y);
  }
}

window.OverworldMaps = {
  DemoRoom: {
    lowerSrc: '/images/maps/DemoLower.png',
    upperSrc: '/images/maps/DemoUpper.png',
    gameObjects: {
      hero: new Person({
        x: utils.withGrid(5),
        y: utils.withGrid(6),
        isPlayerControlled: true
      }),
      npcA: new Person({
        x: utils.withGrid(7),
        y: utils.withGrid(9),
        src: '/images/characters/people/npc1.png',
        behaviorLoop: [
          { type: 'stand', direction: 'left', time: 800 },
          { type: 'stand', direction: 'up', time: 800 },
          { type: 'stand', direction: 'right', time: 800 },
          { type: 'stand', direction: 'up', time: 800 }
        ]
      }),
      npcB: new Person({
        x: utils.withGrid(3),
        y: utils.withGrid(7),
        src: '/images/characters/people/npc2.png',
        behaviorLoop: [
          { type: 'walk', direction: 'left' },
          // { type: 'stand', direction: 'up', time: 800 },
          { type: 'walk', direction: 'up' },
          { type: 'walk', direction: 'right' },
          { type: 'walk', direction: 'down' }
        ]
      })
    },
    walls: {
      [utils.asGridCoord(7, 6)]: true,
      [utils.asGridCoord(8, 6)]: true,
      [utils.asGridCoord(7, 7)]: true,
      [utils.asGridCoord(8, 7)]: true
    }
  },
  Kitchen: {
    lowerSrc: '/images/maps/KitchenLower.png',
    upperSrc: '/images/maps/KitchenUpper.png',
    gameObjects: {
      hero: new Person({
        x: utils.withGrid(3),
        y: utils.withGrid(5)
      }),
      npcA: new GameObject({
        x: 9,
        y: 6,
        src: '/images/characters/people/npc2.png'
      }),
      npcB: new GameObject({
        x: 10,
        y: 8,
        src: '/images/characters/people/npc3.png'
      })
    }
  }
};
