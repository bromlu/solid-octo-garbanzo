import { enemies, player, enemyBullets, playerBullets } from './main'

export class CollisionManager {
  constructor() {

  }

  update() {
    playerBullets.forEach(bullet => {
      if (bullet.sinking || bullet.sunk) return;
      enemies.forEach(enemy => {
        let dx = Math.abs(bullet.x - enemy.x)
        let dy = Math.abs(bullet.y - enemy.y)
        if (dx < enemy.r && dy < enemy.r) {
          bullet.sunk = true;
          this.handleEnemyHurt(enemy);
        }
      });
    });

    enemyBullets.forEach(bullet => {
      if (bullet.sinking || bullet.sunk) return;
      let dx = Math.abs(bullet.x - player.x)
      let dy = Math.abs(bullet.y - player.y)
      if (dx < player.r && dy < player.r) {
        bullet.sunk = true;
        if(player.isDashing) return;
        this.handlePlayerHurt();
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

  }

  handleEnemyHurt(enemy) {
    enemy.handleCollision()
  }

  handlePlayerHurt() {
    player.handleCollision()
  }
}