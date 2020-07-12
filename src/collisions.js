import { enemies, player, enemyBullets, playerBullets, island, obstacles } from './main'
import { enemyTypes} from './globals'

export class CollisionManager {
  constructor() {

  }

  update() {
    playerBullets.forEach(bullet => {
      if (bullet.sinking || bullet.sunk) return;
      enemies.forEach(enemy => {
        if (enemy.sinking || enemy.sunk) return;
        let dx = Math.abs(bullet.x - enemy.x)
        let dy = Math.abs(bullet.y - enemy.y)
        if (dx < enemy.r && dy < enemy.r) {
          bullet.sunk = true;
          this.handleEnemyHurt(enemy);
        }
      });
      obstacles.forEach(obstacle => {
        if(obstacle.type !== enemyTypes.kraken || !obstacle.shown) return;
        let dx = Math.abs(bullet.x - obstacle.x)
        let dy = Math.abs(bullet.y - obstacle.y)
        if (dx < obstacle.r && dy < obstacle.r) {
          bullet.sunk = true;
          this.handleObstacleHurt(obstacle);
        }
      });
    });

    enemyBullets.forEach(bullet => {
      if (bullet.sinking || bullet.sunk) return;
      let dx = Math.abs(bullet.x - player.x)
      let dy = Math.abs(bullet.y - player.y)
      if (dx < player.r && dy < player.r) {
        bullet.sunk = true;
        if (!player.isDashing()) this.handlePlayerHurt();
      }
    });

    enemies.forEach(enemy => {
      let dx = Math.abs(enemy.x - player.x)
      let dy = Math.abs(enemy.y - player.y)
      if (dx < player.r && dy < player.r) {
        if (player.isDashing()) {
          this.handleEnemyHurt(enemy)
        } else {
          this.handlePlayerHurt();
        }
      }
    });

    obstacles.forEach(obstacle => {
      if(!obstacle.shown) return;
      let dx = Math.abs(obstacle.x - player.x)
      let dy = Math.abs(obstacle.y - player.y)
      if (dx < player.r + obstacle.r && dy < player.r + obstacle.r) {
        if (player.isDashing()) {
          this.handleObstacleHurt(obstacle)
        } else {
          this.handlePlayerHurt();
        }
      }
    });
  }

  handleEnemyHurt(enemy) {
    enemy.handleCollision()
  }

  handlePlayerHurt() {
    player.handleCollision()
  }

  handleObstacleHurt(obstacle) {
    obstacle.handleCollision()
  }
}