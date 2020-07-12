import { Enemy } from './enemy';
import { Obstacles } from './obstacles'
import { camera, player, enemies } from './main'
import { RandomMovementAI, PatrolAI, TargettingAI } from './AI'
import { imgs } from './load';
import { enemyTypes } from './globals'

export class Spawner {
  constructor() {
    this.enemiesToSpawn = [];
    this.obstaclesToSpawn = [];
  }

  update() {
    this.updateEnemies();
    this.updateObstacles();
  }

  updateEnemies() {
    let nextEnemy = this.enemiesToSpawn[this.enemiesToSpawn.length - 1];
    if (!nextEnemy) return;
    if (camera.yAnchor - 100 <= nextEnemy.y) {
      console.log(camera.yAnchor, nextEnemy)
      enemies.push(this.enemiesToSpawn.pop());
    }
  }

  updateObstacles() {
    let obstacle = this.obstaclesToSpawn[this.obstaclesToSpawn.length - 1];
    if (!obstacle) return;
    if (camera.yAnchor - 100 <= obstacle.y) {
      console.log(camera.yAnchor, obstacle)
      obstacles.push(this.obstaclesToSpawn.pop());
    }
  }

  addSpawnsForLevel(num) {
    [
      null,
      this.addLevel1Spawns,
      this.addLevel2Spawns,
    ][num].call(this)
  }
  
  addLevel1Spawns() {
    this.enemiesToSpawn = [
      new Enemy(0, -1200, new RandomMovementAI(1000), enemyTypes.manta),
      new Enemy(200, -800, new RandomMovementAI(1000), enemyTypes.manta),
      new Enemy(-200, -800, new RandomMovementAI(1000), enemyTypes.manta),
      new Enemy(0, -800, new RandomMovementAI(1000), enemyTypes.manta),
      new Enemy(0, -700, new TargettingAI(player), enemyTypes.boat),
    ]
    this.obstaclesToSpawn = [
      new Obstacles(0, -1200, enemyTypes.kraken),
      new Obstacles(200, -800, enemyTypes.kraken),
      new Obstacles(-200, -800, enemyTypes.kraken),
      new Obstacles(0, -200, enemyTypes.kraken),
    ]
  }
  
  addLevel2Spawns() {
    console.log("lev2")
    this.enemiesToSpawn = [
      new Enemy(0, -1200, new TargettingAI(player), enemyTypes.boat),
      new Enemy(-200, -900, new TargettingAI(player), enemyTypes.boat),
      new Enemy(200, -800, new TargettingAI(player), enemyTypes.boat),
      new Enemy(0, -800, new TargettingAI(player), enemyTypes.boat),
    ]
  }
}
