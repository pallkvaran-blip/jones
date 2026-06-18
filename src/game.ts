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

  const game = new Phaser.Game(config)

  game.scale.on('resize', (gameSize: Phaser.Structs.Size) => {
    const canvas = game.canvas
    requestAnimationFrame(() => {
      const rect = canvas.getBoundingClientRect()
      const scale = rect.width / 960
      const r = document.documentElement.style
      r.setProperty('--cv-left',   `${rect.left}px`)
      r.setProperty('--cv-top',    `${rect.top}px`)
      r.setProperty('--cv-width',  `${rect.width}px`)
      r.setProperty('--cv-height', `${rect.height}px`)
      r.setProperty('--cv-scale',  `${scale}`)
      r.setProperty('--cv-panel-action', `${Math.round(152 * scale)}px`)
      r.setProperty('--cv-panel-stats',  `${Math.round(240 * scale)}px`)
    })
  })
  // Also fire once immediately after a short delay for the initial render
  setTimeout(() => game.scale.emit('resize', game.scale.gameSize), 100)

  return game
}
