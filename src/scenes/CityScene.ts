import Phaser from 'phaser'
import { getStore } from '../state/store'
import { locations, getLocationById } from '../data/locations'
import { consumeTime } from '../systems/TimeSystem'
import { audioSystem } from '../systems/AudioSystem'
import { Avatar } from '../entities/Avatar'
import { LocationSprite } from '../entities/LocationSprite'
import { HUD } from '../ui/HUD'
import type { LocationId } from '../state/types'

const MAP_WIDTH = 520;
const MAP_HEIGHT = 450;

export class CityScene extends Phaser.Scene {
  private avatar!: Avatar;
  private locationSprites: Map<LocationId, LocationSprite> = new Map();
  private hud!: HUD;
  private skyGraphics!: Phaser.GameObjects.Graphics;
  private roadGraphics!: Phaser.GameObjects.Graphics;
  private overlayText: Phaser.GameObjects.Text | null = null;
  private unsubscribeStore: (() => void) | null = null;
  private muteButton: HTMLButtonElement | null = null;

  constructor() {
    super({ key: 'CityScene' });
  }

  create(): void {
    const store = getStore();
    const state = store.getState();

    // --- Background ---
    this.add.rectangle(MAP_WIDTH / 2, 225, MAP_WIDTH, 450, 0x1a1a2e);

    // Right panel background (behind HUD)
    this.add.rectangle(MAP_WIDTH + (800 - MAP_WIDTH) / 2, 225, 800 - MAP_WIDTH, 450, 0x0d0d1a);

    // Sky gradient strip (top 30px of map)
    this.skyGraphics = this.add.graphics();
    this.drawSky(state.calendar.timeUnits);

    // --- Roads ---
    this.roadGraphics = this.add.graphics();
    this.drawRoads();

    // --- Location sprites ---
    for (const loc of locations) {
      const sprite = new LocationSprite(this, loc);
      this.locationSprites.set(loc.id, sprite);

      sprite.on('locationClicked', (id: LocationId) => {
        this.handleLocationClick(id);
      });
    }

    // Set initial active location
    const activeLoc = this.locationSprites.get(state.currentLocationId);
    if (activeLoc) activeLoc.setLocationActive(true);

    // --- Avatar ---
    const homeLoc = getLocationById('home');
    const homeSprite = this.locationSprites.get('home');
    const startX = homeSprite ? homeSprite.getCenter().x : homeLoc.x + homeLoc.width / 2;
    const startY = homeSprite ? homeSprite.getCenter().y : homeLoc.y + homeLoc.height / 2;
    this.avatar = new Avatar(this, startX, startY);

    // --- HUD ---
    this.hud = new HUD();
    this.hud.mount();
    this.hud.update(state);

    // --- Mute button ---
    this.createMuteButton();

    // --- Store subscription ---
    this.unsubscribeStore = store.subscribe((newState) => {
      this.hud.update(newState);
      this.drawSky(newState.calendar.timeUnits);

      if (newState.isGameOver) {
        this.time.delayedCall(500, () => {
          this.scene.start('GameOverScene');
        });
      }
    });
  }

  private drawSky(timeUnits: number): void {
    this.skyGraphics.clear();

    // Lerp sky color based on time units:
    // 100 = pale blue (#87CEEB)
    // 50  = orange (#FF8C00)
    // 0   = deep purple (#1a0033)
    let r: number, g: number, b: number;

    if (timeUnits >= 50) {
      const t = (timeUnits - 50) / 50;
      r = Math.round(0xFF * (1 - t) + 0x87 * t);
      g = Math.round(0x8C * (1 - t) + 0xCE * t);
      b = Math.round(0x00 * (1 - t) + 0xEB * t);
    } else {
      const t = timeUnits / 50;
      r = Math.round(0x1a * (1 - t) + 0xFF * t);
      g = Math.round(0x00 * (1 - t) + 0x8C * t);
      b = Math.round(0x33 * (1 - t) + 0x00 * t);
    }

    const color = (r << 16) | (g << 8) | b;
    this.skyGraphics.fillStyle(color, 1);
    this.skyGraphics.fillRect(0, 0, MAP_WIDTH, 30);
  }

  private drawRoads(): void {
    const g = this.roadGraphics;
    g.clear();

    const ROAD_COLOR = 0xf5f0e8;
    const SIDEWALK_COLOR = 0xe8e0cc;

    // Column positions (x of road centers) between building columns
    // Columns at x=15,140,265,390 with width 110
    // Roads between: after col0 (125), after col1 (250), after col2 (375)
    // Row positions (y of road centers) between building rows
    // Rows at y=40,170,300 with height 100
    // Roads between: after row0 (140), after row1 (270)
    // Also borders

    const roadWidth = 20;
    const sidewalkWidth = 4;

    // Vertical roads (between columns + left/right edges)
    const vRoadXs = [0, 125, 250, 375, MAP_WIDTH];
    for (const x of vRoadXs) {
      // Sidewalk
      g.fillStyle(SIDEWALK_COLOR, 1);
      g.fillRect(x - sidewalkWidth / 2, 30, sidewalkWidth + roadWidth, MAP_HEIGHT - 30);
      // Road
      g.fillStyle(ROAD_COLOR, 0.7);
      g.fillRect(x, 30, roadWidth, MAP_HEIGHT - 30);
    }

    // Horizontal roads (between rows + top/bottom edges)
    const hRoadYs = [30, 140, 270, 400];
    for (const y of hRoadYs) {
      g.fillStyle(SIDEWALK_COLOR, 1);
      g.fillRect(0, y - sidewalkWidth / 2, MAP_WIDTH, sidewalkWidth + roadWidth);
      g.fillStyle(ROAD_COLOR, 0.7);
      g.fillRect(0, y, MAP_WIDTH, roadWidth);
    }
  }

  private handleLocationClick(id: LocationId): void {
    audioSystem.playSFX('click');

    const store = getStore();
    const state = store.getState();

    if (state.currentLocationId === id) {
      // Already here — show toast
      this.showToast(`You are at ${getLocationById(id).name}`);
      return;
    }

    if (this.avatar.isCurrentlyMoving()) return;

    const targetSprite = this.locationSprites.get(id);
    if (!targetSprite) return;

    // Update active location indicator
    const prevSprite = this.locationSprites.get(state.currentLocationId);
    if (prevSprite) prevSprite.setLocationActive(false);

    const targetCenter = targetSprite.getCenter();

    audioSystem.playSFX('move');

    // Start movement
    this.avatar.moveTo(targetCenter.x, targetCenter.y, () => {
      audioSystem.playSFX('arrive');

      store.setState(s => {
        const afterMove = consumeTime(s, 10);
        const withLocation = { ...afterMove, currentLocationId: id };

        // Check if day advanced
        const dayAdvanced = withLocation.calendar.day !== s.calendar.day ||
                            withLocation.calendar.week !== s.calendar.week;
        const weekAdvanced = withLocation.calendar.week !== s.calendar.week;

        if (weekAdvanced) {
          audioSystem.playSFX('weekEnd');
          this.showDayBanner(`Week ${withLocation.calendar.week}`);
        } else if (dayAdvanced) {
          audioSystem.playSFX('dayEnd');
          this.showDayBanner(`Day ${withLocation.calendar.day} — ${this.getDayName(withLocation.calendar.day)}`);
        }

        return withLocation;
      });

      targetSprite.setLocationActive(true);
    });
  }

  private getDayName(day: number): string {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days[Math.max(0, Math.min(6, day - 1))];
  }

  private showToast(message: string): void {
    if (this.overlayText) {
      this.overlayText.destroy();
      this.overlayText = null;
    }

    const text = this.add.text(MAP_WIDTH / 2, 225, message, {
      fontSize: '16px',
      color: '#ffffff',
      backgroundColor: 'rgba(0,0,0,0.75)',
      padding: { x: 16, y: 8 },
      align: 'center',
    });
    text.setOrigin(0.5, 0.5);
    text.setDepth(50);
    this.overlayText = text;

    this.tweens.add({
      targets: text,
      alpha: { from: 1, to: 0 },
      delay: 1500,
      duration: 500,
      onComplete: () => {
        text.destroy();
        if (this.overlayText === text) this.overlayText = null;
      },
    });
  }

  private showDayBanner(message: string): void {
    const text = this.add.text(MAP_WIDTH / 2, 225, message, {
      fontSize: '24px',
      fontStyle: 'bold',
      color: '#F5A623',
      backgroundColor: 'rgba(0,0,0,0.8)',
      padding: { x: 24, y: 12 },
      align: 'center',
    });
    text.setOrigin(0.5, 0.5);
    text.setDepth(50);
    text.setAlpha(0);

    this.tweens.add({
      targets: text,
      alpha: { from: 0, to: 1 },
      y: { from: 260, to: 225 },
      duration: 300,
      ease: 'Power2',
      onComplete: () => {
        this.tweens.add({
          targets: text,
          alpha: 0,
          delay: 1800,
          duration: 500,
          onComplete: () => text.destroy(),
        });
      },
    });
  }

  private createMuteButton(): void {
    const uiRoot = document.getElementById('ui-root');
    if (!uiRoot) return;

    this.muteButton = document.createElement('button');
    this.muteButton.id = 'mute-btn';
    this.muteButton.textContent = '🔊';
    this.muteButton.style.cssText = `
      position: fixed;
      top: 8px;
      right: 270px;
      width: 32px;
      height: 32px;
      background: rgba(13,13,30,0.85);
      border: 1px solid #444;
      border-radius: 4px;
      color: #e0e0e0;
      font-size: 16px;
      cursor: pointer;
      z-index: 300;
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: auto;
      padding: 0;
    `;

    this.muteButton.addEventListener('click', () => {
      const muted = !audioSystem.isMuted();
      audioSystem.setMuted(muted);
      if (this.muteButton) {
        this.muteButton.textContent = muted ? '🔇' : '🔊';
      }
    });

    uiRoot.appendChild(this.muteButton);
  }

  shutdown(): void {
    if (this.unsubscribeStore) {
      this.unsubscribeStore();
      this.unsubscribeStore = null;
    }
    this.hud.unmount();
    audioSystem.stopBGM();

    // Remove mute button
    if (this.muteButton?.parentNode) {
      this.muteButton.parentNode.removeChild(this.muteButton);
      this.muteButton = null;
    }
  }
}
