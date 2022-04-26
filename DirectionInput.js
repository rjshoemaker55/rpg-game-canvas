class DirectionInput {
  constructor() {
    this.heldDirections = [];

    this.map = {
      ArrowUp: 'up',
      KeyW: 'up',
      ArrowDown: 'down',
      KeyS: 'down',
      ArrowLeft: 'left',
      KeyA: 'left',
      ArrowRight: 'right',
      KeyD: 'right'
    };
  }

  get direction() {
    return this.heldDirections[0];
  }

  init() {
    document.addEventListener('keydown', (e) => {
      const direction = this.map[e.code];

      if (direction && this.heldDirections.indexOf(direction) === -1) {
        this.heldDirections.unshift(direction);
        console.log(this.heldDirections);
      }

      document.addEventListener('keyup', (e) => {
        const direction = this.map[e.code];
        const index = this.heldDirections.indexOf(direction);

        if (index > -1) {
          this.heldDirections.splice(index, 1);
          console.log(this.heldDirections);
        }
      });
    });
  }
}
