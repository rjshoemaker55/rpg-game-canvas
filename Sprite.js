class Sprite {
  constructor(config) {
    // set up image
    this.image = new Image();
    this.image.src = config.src;
    this.image.onload = () => {
      this.isLoaded = true;
    };

    // set up shadow
    this.shadow = new Image();
    this.useShadow = true;
    if (this.useShadow) {
      this.shadow.src = '/images/characters/shadow.png';
    }
    this.shadow.onload = () => {
      this.shadowLoaded = true;
    };

    // configure animation and initial state
    this.animations = config.animations || {
      idleDown: [[0, 0]]
    };
    this.currentAnimation = config.currentAnimation || 'idleDown';
    this.currentAnimationFrame = 0;

    // reference the game object
    this.gameObject = config.gameObject;
  }

  draw(ctx) {
    const x = this.gameObject.x - 8;
    const y = this.gameObject.y - 18;

    this.shadowLoaded && ctx.drawImage(this.shadow, x, y);
    this.isLoaded && ctx.drawImage(this.image, 0, 0, 32, 32, x, y, 32, 32);
  }
}