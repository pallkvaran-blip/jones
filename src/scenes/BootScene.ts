import Phaser from 'phaser'
import { locations } from '../data/locations'

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload(): void {
    // No external assets to load — all generated programmatically
  }

  create(): void {
    this.createTextures();
    this.scene.start('MenuScene');
  }

  private createTextures(): void {
    const graphics = this.make.graphics({ x: 0, y: 0 });

    // Avatar texture: yellow circle with white stroke
    // ASSET: swap in real sprite here
    graphics.clear();
    graphics.fillStyle(0xF5A623, 1);
    graphics.fillCircle(12, 12, 11);
    graphics.lineStyle(2, 0xFFFFFF, 1);
    graphics.strokeCircle(12, 12, 11);
    graphics.generateTexture('avatar', 24, 24);

    // Road horizontal strip
    graphics.clear();
    graphics.fillStyle(0xf5f0e8, 1);
    graphics.fillRect(0, 0, 200, 28);
    // Road markings
    graphics.fillStyle(0xd4c8b0, 1);
    graphics.fillRect(0, 13, 200, 2);
    graphics.generateTexture('road-h', 200, 28);

    // Road vertical strip
    graphics.clear();
    graphics.fillStyle(0xf5f0e8, 1);
    graphics.fillRect(0, 0, 28, 200);
    graphics.fillStyle(0xd4c8b0, 1);
    graphics.fillRect(13, 0, 2, 200);
    graphics.generateTexture('road-v', 28, 200);

    // Building textures for each location
    // ASSET: swap in real building sprite here
    for (const loc of locations) {
      const w = loc.width;
      const h = loc.height;
      const roofH = 18;

      graphics.clear();

      // Parse colors
      const bodyColor = Phaser.Display.Color.HexStringToColor(loc.color).color;
      const roofColor = Phaser.Display.Color.HexStringToColor(loc.darkColor).color;

      // Building body
      graphics.fillStyle(bodyColor, 1);
      graphics.fillRect(0, roofH, w, h - roofH);

      // Roof
      graphics.fillStyle(roofColor, 1);
      graphics.fillRect(0, 0, w, roofH);

      // Window grid
      graphics.fillStyle(0xFFFFDD, 0.6);
      const winW = 12, winH = 10, winPadX = 10, winPadY = 8;
      const cols = Math.floor((w - winPadX * 2) / (winW + 6));
      const rows = Math.floor((h - roofH - winPadY * 2) / (winH + 6));
      for (let r = 0; r < Math.max(1, rows); r++) {
        for (let c = 0; c < Math.max(1, cols); c++) {
          const wx = winPadX + c * (winW + 6);
          const wy = roofH + winPadY + r * (winH + 6);
          graphics.fillRect(wx, wy, winW, winH);
        }
      }

      graphics.generateTexture(`building-${loc.id}`, w, h);
    }

    graphics.destroy();
  }
}
