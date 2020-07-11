import { enemies, player, enemyBullets } from './main'

export class CollisionManager {
  constructor() {

  }

  update() {
    // TODO player bullets
    enemyBullets.forEach(bullet => {
      if (bullet.sinking || bullet.sunk) return;
      let dx = Math.abs(bullet.x - player.x)
      let dy = Math.abs(bullet.y - player.y)
      if (dx < player.r && dy < player.r) {
        bullet.sunk = true;
        this.handlePlayerHurt();
      }
    });

    enemies.forEach(enemy => {
      let dx = Math.abs(enemy.x - player.x)
      let dy = Math.abs(enemy.y - player.y)
      if (dx < player.r && dy < player.r) {
        console.log(player.v);
        if (player.v > 10) {
          this.handleEnemyHurt()
        } else {
          this.handlePlayerHurt();
        }
      }
    });

  }

  handleEnemyHurt() {
    console.log("Gotcha")
  }

  handlePlayerHurt() {
    player.handleCollision()
  }
}