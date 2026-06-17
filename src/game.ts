import Phaser from 'phaser'
import { BootScene } from './scenes/BootScene'
import { MenuScene } from './scenes/MenuScene'
import { CityScene } from './scenes/CityScene'
import { GameOverScene } from './scenes/GameOverScene'

export function createGame(): Phaser.Game {
  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 450,
    backgroundColor: '#1a1a2e',
    parent: 'game-container',
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: [BootScene, MenuScene, CityScene, GameOverScene],
    render: {
      antialias: true,
      pixelArt: false,
    },
  }

  return new Phaser.Game(config)
}
