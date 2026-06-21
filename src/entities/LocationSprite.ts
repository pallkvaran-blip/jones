import Phaser from 'phaser'
import type { LocationDef } from '../data/locations'
import type { LocationId } from '../state/types'

// ASSET: replace generated pixel facade with real sprite here

export class LocationSprite extends Phaser.GameObjects.Container {
  private locationDef: LocationDef
  private building: Phaser.GameObjects.Image
  private dropShadow: Phaser.GameObjects.Rectangle
  private namePlate: Phaser.GameObjects.Rectangle
  private nameText: Phaser.GameObjects.Text
  private glow: Phaser.GameObjects.Rectangle
  private hitZone: Phaser.GameObjects.Zone
  private isActive = false

  constructor(scene: Phaser.Scene, def: LocationDef) {
    // Container anchored at building top-left so the Image lines up exactly.
    super(scene, def.x, def.y)
    this.locationDef = def

    const w = def.width
    const h = def.height

    // Bright active-glow outline (hidden unless active).
    this.glow = scene.add.rectangle(w / 2, h / 2, w + 10, h + 10, 0xfff2a8, 0.0)
    this.glow.setStrokeStyle(3, 0xffe066, 0.9)
    this.glow.setVisible(false)
    this.add(this.glow)

    // Soft drop shadow (offset dark block).
    this.dropShadow = scene.add.rectangle(w / 2 + 6, h / 2 + 8, w, h, 0x000000, 0.3)
    this.add(this.dropShadow)

    // The detailed pixel-art building texture.
    this.building = scene.add.image(0, 0, `building-${def.id}`)
    this.building.setOrigin(0, 0)
    this.building.setDisplaySize(w, h)
    this.add(this.building)

    // Sign plate + name beneath the building.
    const plateW = w - 8
    const plateY = h + 18
    this.namePlate = scene.add.rectangle(w / 2, plateY, plateW, 22, 0x14141f, 0.92)
    this.namePlate.setStrokeStyle(2, 0x3a3a52, 1)
    this.add(this.namePlate)

    this.nameText = scene.add.text(w / 2, plateY, def.name.toUpperCase(), {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: '8px',
      color: '#e8e8f0',
      align: 'center',
      wordWrap: { width: plateW - 6 },
    })
    this.nameText.setOrigin(0.5, 0.5)
    this.nameText.setResolution(3)
    this.add(this.nameText)

    // Dedicated zone at world coords for reliable hit detection.
    // Zones are processed by Phaser's input system independently of the Container
    // transform chain, giving 100% reliable pointer events.
    this.hitZone = scene.add.zone(def.x, def.y, w, h)
    this.hitZone.setOrigin(0, 0)
    this.hitZone.setDepth(9)
    this.hitZone.setInteractive({ cursor: 'pointer' })
    this.hitZone.on('pointerover', () => this.onPointerOver())
    this.hitZone.on('pointerout', () => this.onPointerOut())
    this.hitZone.on('pointerdown', () => this.onPointerDown())

    scene.add.existing(this as unknown as Phaser.GameObjects.GameObject)
  }

  private onPointerOver(): void {
    if (!this.isActive) {
      this.building.setTint(0xfff0c0)
    }
  }

  private onPointerOut(): void {
    this.building.clearTint()
  }

  private onPointerDown(): void {
    this.emit('locationClicked', this.locationDef.id as LocationId)
  }

  setLocationActive(active: boolean): void {
    this.isActive = active
    this.glow.setVisible(active)
    if (active) {
      this.building.clearTint()
      this.scene.tweens.add({
        targets: this.glow,
        alpha: { from: 0.0, to: 0.35 },
        duration: 700,
        yoyo: true,
        repeat: -1,
      })
    } else {
      this.scene.tweens.killTweensOf(this.glow)
      this.glow.setAlpha(0)
    }
  }

  getId(): LocationId {
    return this.locationDef.id
  }

  /** Doorstep point the avatar walks to. */
  getCenter(): { x: number; y: number } {
    return { x: this.locationDef.cx, y: this.locationDef.cy }
  }
}
