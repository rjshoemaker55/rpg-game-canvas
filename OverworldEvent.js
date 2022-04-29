class OverworldEvent {
  constructor({ map, event }) {
    this.map = map;
    this.event = event;
  }

  stand(resolve) {}

  walk(resolve) {
    const who = this.map.gameObjects[this.event.who];

    who.startBehavior(
      {
        map: this.map
      },
      {
        type: 'walk',
        direction: this.event.direction
      }
    );

    // setup a handler to complete when correct person is done walking ,then resolve the event
    const completeHandler = (e) => {
      if (e.detail.whoId === this.event.who) {
        document.removeEventListener('PersonWalkingComplete', completeHandler);
      }
    };

    document.addEventListener('PersonWalkingComplete', completeHandler);
  }

  init() {
    return new Promise((resolve) => {
      this[this.event.type](resolve);
    });
  }
}
