import Phaser from 'phaser'

// ASSET: swap in character spritesheet here

export class Avatar {
  private scene: Phaser.Scene;
  private container: Phaser.GameObjects.Container;
  private body: Phaser.GameObjects.Arc;
  private directionIndicator: Phaser.GameObjects.Triangle;
  private isMoving = false;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.scene = scene;

    // Body: yellow circle
    this.body = scene.add.circle(0, 0, 12, 0xF5A623);
    this.body.setStrokeStyle(2, 0xFFFFFF);

    // Direction arrow: small triangle pointing right by default
    this.directionIndicator = scene.add.triangle(
      16, 0,   // center
      0, -5,   // point 1
      0,  5,   // point 2
      8,  0,   // point 3 (tip)
      0xFFFFFF
    );

    this.container = scene.add.container(x, y, [this.body, this.directionIndicator]);
    this.container.setDepth(10);
  }

  getContainer(): Phaser.GameObjects.Container {
    return this.container;
  }

  getPosition(): { x: number; y: number } {
    return { x: this.container.x, y: this.container.y };
  }

  moveTo(x: number, y: number, onComplete: () => void): void {
    if (this.isMoving) return;
    this.isMoving = true;

    // Update direction indicator angle
    const dx = x - this.container.x;
    const dy = y - this.container.y;
    const angle = Math.atan2(dy, dx);
    this.directionIndicator.setRotation(angle);

    // Scale pulse tween during movement
    const pulseTween = this.scene.tweens.add({
      targets: this.container,
      scaleX: { from: 0.9, to: 1.1 },
      scaleY: { from: 0.9, to: 1.1 },
      duration: 200,
      yoyo: true,
      repeat: -1,
    });

    // Movement tween
    this.scene.tweens.add({
      targets: this.container,
      x,
      y,
      duration: 600,
      ease: 'Power2',
      onComplete: () => {
        pulseTween.stop();
        this.container.setScale(1);
        this.isMoving = false;
        onComplete();
      },
    });
  }

  setPosition(x: number, y: number): void {
    this.container.setPosition(x, y);
  }

  isCurrentlyMoving(): boolean {
    return this.isMoving;
  }

  destroy(): void {
    this.container.destroy();
  }
}
