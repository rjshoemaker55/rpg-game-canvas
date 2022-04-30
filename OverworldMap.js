class OverworldMap {
  constructor(config) {
    this.overworld = null;
    this.gameObjects = config.gameObjects;
    this.cutsceneSpaces = config.cutsceneSpaces || {};
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

  // takes in an array of events
  async startCutscene(events) {
    // stop all objects from doing theyre normal behavior loop
    // and stop hero from being able to move
    this.isCutscenePlaying = true;

    // loop through each event passed in for this game object
    for (let i = 0; i < events.length; i++) {
      // create a new event object for each event, passing in the current event in the array and this map
      const eventHandler = new OverworldEvent({
        event: events[i],
        map: this
      });

      // init the event, and when its done, set cutscene to false
      await eventHandler.init();
    }

    this.isCutscenePlaying = false;

    // reset npcs to do their idle behavior
    Object.values(this.gameObjects).forEach((object) =>
      object.doBehaviorEvent(this)
    );
  }

  checkForActionCutscene() {
    // instantiate a new constant called hero with the value being the hero Person object
    const hero = this.gameObjects['hero'];

    // get the next coords for the player
    const nextCoords = utils.nextPosition(hero.x, hero.y, hero.direction);

    // loop through each game object value, and find out if one is in the location we are in front of
    // returns the game object that matches
    const match = Object.values(this.gameObjects).find((object) => {
      return `${object.x},${object.y}` === `${nextCoords.x},${nextCoords.y}`;
    });

    // if there was a game object matching what were looking for and if it has a talking event,
    if (!this.isCutscenePlaying && match && match.talking.length) {
      // start a cutscene and pass in the talking events from the game object
      this.startCutscene(match.talking[0].events);
    }
  }

  checkForFootstepCutscene() {
    const hero = this.gameObjects['hero'];
    const match = this.cutsceneSpaces[`${hero.x},${hero.y}`];

    if (!this.isCutscenePlaying && match) {
      this.startCutscene(match[0].events);
    }
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
        ],
        talking: [
          {
            events: [
              {
                type: 'textMessage',
                text: 'Why hello there.',
                faceHero: 'npcA'
              },
              {
                type: 'textMessage',
                text: 'Im busy, go away'
              },
              {
                who: 'hero',
                type: 'walk',
                direction: 'up'
              },
              {
                who: 'hero',
                type: 'walk',
                direction: 'up'
              },
              {
                who: 'hero',
                type: 'walk',
                direction: 'up'
              },
              {
                who: 'hero',
                type: 'stand',
                direction: 'left'
              }
            ]
          }
        ]
      }),
      npcB: new Person({
        x: utils.withGrid(8),
        y: utils.withGrid(5),
        src: '/images/characters/people/npc2.png'
        // behaviorLoop: [
        //   { type: 'walk', direction: 'left' },
        //   { type: 'stand', direction: 'up', time: 800 },
        //   { type: 'walk', direction: 'up' },
        //   { type: 'walk', direction: 'right' },
        //   { type: 'walk', direction: 'down' }
        // ]
      })
    },
    walls: {
      [utils.asGridCoord(7, 6)]: true,
      [utils.asGridCoord(8, 6)]: true,
      [utils.asGridCoord(7, 7)]: true,
      [utils.asGridCoord(8, 7)]: true
    },
    cutsceneSpaces: {
      [utils.asGridCoord(7, 4)]: [
        {
          events: [
            { who: 'npcB', type: 'walk', direction: 'left' },
            { who: 'npcB', type: 'stand', direction: 'up', time: 500 },
            { type: 'textMessage', text: "You can't be in there!" },
            { who: 'npcB', type: 'walk', direction: 'right' },
            { who: 'hero', type: 'walk', direction: 'down' },
            { who: 'hero', type: 'walk', direction: 'left' }
          ]
        }
      ],
      [utils.asGridCoord(5, 10)]: [
        {
          events: [{ type: 'changeMap', map: 'Kitchen' }]
        }
      ]
    }
  },
  Kitchen: {
    lowerSrc: '/images/maps/KitchenLower.png',
    upperSrc: '/images/maps/KitchenUpper.png',
    gameObjects: {
      hero: new Person({
        isPlayerControlled: true,
        x: utils.withGrid(3),
        y: utils.withGrid(5)
      }),
      npcA: new Person({
        x: utils.withGrid(9),
        y: utils.withGrid(6),
        src: '/images/characters/people/npc3.png',
        talking: [
          {
            events: [
              {
                who: 'npcA',
                type: 'textMessage',
                text: 'You made it!',
                faceHero: 'npcA'
              },
              { who: 'npcA', type: 'walk', direction: 'right' },
              { who: 'npcA', type: 'walk', direction: 'right' },
              { who: 'npcA', type: 'walk', direction: 'down' },
              { who: 'npcA', type: 'stand', direction: 'left' }
            ]
          }
        ]
      })
    }
  }
};
