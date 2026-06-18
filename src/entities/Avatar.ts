import Phaser from 'phaser'

// ASSET: replace with real character spritesheet here

export class Avatar {
  private scene: Phaser.Scene
  private container: Phaser.GameObjects.Container
  private sprite: Phaser.GameObjects.Image
  private shadow: Phaser.GameObjects.Image
  private isMoving = false
  private walkTimer: Phaser.Time.TimerEvent | null = null
  private frame = 0

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.scene = scene

    // Soft elliptical shadow under the character.
    this.shadow = scene.add.image(0, 22, 'soft-shadow')
    this.shadow.setOrigin(0.5, 0.5)
    this.shadow.setScale(0.7)

    // Character body uses the standing frame by default.
    this.sprite = scene.add.image(0, 0, 'avatar-0')
    this.sprite.setOrigin(0.5, 0.85) // feet near the doorstep point

    this.container = scene.add.container(x, y, [this.shadow, this.sprite])
    this.container.setDepth(20)
  }

  getContainer(): Phaser.GameObjects.Container {
    return this.container
  }

  getPosition(): { x: number; y: number } {
    return { x: this.container.x, y: this.container.y }
  }

  private startWalk(): void {
    this.walkTimer?.remove()
    this.walkTimer = this.scene.time.addEvent({
      delay: 140,
      loop: true,
      callback: () => {
        this.frame = this.frame === 0 ? 1 : 0
        this.sprite.setTexture(this.frame === 0 ? 'avatar-0' : 'avatar-1')
      },
    })
  }

  private stopWalk(): void {
    this.walkTimer?.remove()
    this.walkTimer = null
    this.frame = 0
    this.sprite.setTexture('avatar-0')
  }

  moveTo(x: number, y: number, onComplete: () => void): void {
    if (this.isMoving) return
    this.isMoving = true

    // Face travel direction by flipping horizontally.
    const dx = x - this.container.x
    if (dx < -1) this.sprite.setFlipX(true)
    else if (dx > 1) this.sprite.setFlipX(false)

    this.startWalk()

    this.scene.tweens.add({
      targets: this.container,
      x,
      y,
      duration: 700,
      ease: 'Sine.InOut',
      onComplete: () => {
        this.stopWalk()
        this.isMoving = false
        onComplete()
      },
    })
  }

  setPosition(x: number, y: number): void {
    this.container.setPosition(x, y)
  }

  isCurrentlyMoving(): boolean {
    return this.isMoving
  }

  destroy(): void {
    this.walkTimer?.remove()
    this.container.destroy()
  }
}
