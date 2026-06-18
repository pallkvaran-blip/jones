import Phaser from 'phaser'
import { BootScene } from './scenes/BootScene'
import { MenuScene } from './scenes/MenuScene'
import { CityScene } from './scenes/CityScene'
import { GameOverScene } from './scenes/GameOverScene'

export function createGame(): Phaser.Game {
  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 960,
    height: 540,
    backgroundColor: '#0d0d17',
    parent: 'game-container',
    pixelArt: true,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: [BootScene, MenuScene, CityScene, GameOverScene],
    render: {
      antialias: false,
      pixelArt: true,
      roundPixels: true,
    },
  }

  return new Phaser.Game(config)
}
