class GameObject {
  constructor(config) {
    this.id = null;
    this.isMounted = false;
    this.x = config.x || 0;
    this.y = config.y || 0;
    this.direction = config.direction || 'down';

    // create the sprite for each object, passing this class and the source, defaulting to hero
    this.sprite = new Sprite({
      gameObject: this,
      src: config.src || '/images/characters/people/hero.png'
    });

    // set the behavior loop sent from the config or empty, and start the index at 0
    this.behaviorLoop = config.behaviorLoop || [];
    this.behaviorLoopIndex = 0;
  }

  // add a wall to the map where the object is
  mount(map) {
    this.isMounted = true;
    map.addWall(this.x, this.y);

    // if we have a behavior, kick off after a short delay
    setTimeout(() => {
      this.doBehaviorEvent(map);
    }, 10);
  }

  async doBehaviorEvent(map) {
    if (map.isCutscenePlaying || this.behaviorLoop.length === 0) {
      return;
    }
    // setting up event with event config
    let eventConfig = this.behaviorLoop[this.behaviorLoopIndex];
    eventConfig.who = this.id;

    // create event instance out of our next event config
    const eventHandler = new OverworldEvent({ map, event: eventConfig });
    await eventHandler.init();

    // setting next event to fire
    this.behaviorLoopIndex++;

    if (this.behaviorLoopIndex === this.behaviorLoopIndex.length) {
      this.behaviorLoopIndex = 0;
    }

    this.doBehaviorEvent(map);
  }

  update() {}
}
