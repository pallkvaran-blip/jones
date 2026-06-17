import Phaser from 'phaser'
import type { LocationDef } from '../data/locations'
import type { LocationId } from '../state/types'

// ASSET: swap in real building sprite here

export class LocationSprite extends Phaser.GameObjects.Container {
  private locationDef: LocationDef;
  private building: Phaser.GameObjects.Rectangle;
  private roof: Phaser.GameObjects.Rectangle;
  private iconText: Phaser.GameObjects.Text;
  private nameText: Phaser.GameObjects.Text;
  private glowRect: Phaser.GameObjects.Rectangle;
  private isActive = false;

  constructor(scene: Phaser.Scene, def: LocationDef) {
    super(scene, def.x + def.width / 2, def.y + def.height / 2);
    this.locationDef = def;

    const hw = def.width / 2;
    const hh = def.height / 2;
    const roofH = 18;

    // Glow rectangle (hidden by default, shown when active)
    this.glowRect = scene.add.rectangle(0, 0, def.width + 8, def.height + 8, 0xFFFFFF, 0.15);
    this.glowRect.setVisible(false);
    this.add(this.glowRect);

    // Building body
    this.building = scene.add.rectangle(0, roofH / 2, def.width, def.height - roofH, Phaser.Display.Color.HexStringToColor(def.color).color);
    this.add(this.building);

    // Roof strip (darker)
    this.roof = scene.add.rectangle(0, -hh + roofH / 2, def.width, roofH, Phaser.Display.Color.HexStringToColor(def.darkColor).color);
    this.add(this.roof);

    // Icon emoji (centered on building body)
    this.iconText = scene.add.text(0, 4, def.icon, {
      fontSize: '28px',
      align: 'center',
    });
    this.iconText.setOrigin(0.5, 0.5);
    this.add(this.iconText);

    // Name label below building
    this.nameText = scene.add.text(0, hh + 10, def.name, {
      fontSize: '9px',
      color: '#e0e0e0',
      align: 'center',
      wordWrap: { width: def.width + 10 },
    });
    this.nameText.setOrigin(0.5, 0);
    this.add(this.nameText);

    // Enable input
    this.setSize(def.width, def.height + 30);
    this.setInteractive({ cursor: 'pointer' });

    // Hover effects
    this.on('pointerover', this.onPointerOver, this);
    this.on('pointerout', this.onPointerOut, this);
    this.on('pointerdown', this.onPointerDown, this);

    scene.add.existing(this as unknown as Phaser.GameObjects.GameObject);
  }

  private onPointerOver(): void {
    if (!this.isActive) {
      this.scene.tweens.add({
        targets: this,
        scaleX: 1.05,
        scaleY: 1.05,
        duration: 100,
        ease: 'Power1',
      });
    }
    this.building.setStrokeStyle(2, 0xFFFFFF);
    this.roof.setStrokeStyle(2, 0xFFFFFF);
  }

  private onPointerOut(): void {
    if (!this.isActive) {
      this.scene.tweens.add({
        targets: this,
        scaleX: 1,
        scaleY: 1,
        duration: 100,
        ease: 'Power1',
      });
    }
    this.building.setStrokeStyle(0);
    this.roof.setStrokeStyle(0);
  }

  private onPointerDown(): void {
    this.emit('locationClicked', this.locationDef.id as LocationId);
  }

  setLocationActive(active: boolean): void {
    this.isActive = active;
    this.glowRect.setVisible(active);
    if (active) {
      this.setScale(1.05);
      // Pulse glow
      this.scene.tweens.add({
        targets: this.glowRect,
        alpha: { from: 0.1, to: 0.3 },
        duration: 800,
        yoyo: true,
        repeat: -1,
      });
    } else {
      this.setScale(1);
      this.scene.tweens.killTweensOf(this.glowRect);
      this.glowRect.setAlpha(0.15);
    }
  }

  getId(): LocationId {
    return this.locationDef.id;
  }

  getCenter(): { x: number; y: number } {
    return { x: this.x, y: this.y };
  }
}
