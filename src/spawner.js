import { Enemy } from './enemy';
import { camera, player, enemies } from './main'
import { RandomMovementAI, PatrolAI, TargettingAI } from './AI'
import { imgs } from './load';

export class Spawner {
  constructor() {
    this.enemiesToSpawn = [];
  }

  update() {
    let nextEnemy = this.enemiesToSpawn[this.enemiesToSpawn.length - 1];
    if (!nextEnemy) return;
    if (camera.yAnchor <= nextEnemy.y) {
      enemies.push(this.enemiesToSpawn.pop());
    }

  }
  addSpawnsForLevel(num) {
    [
      null,
      this.addLevel1Spawns,
      this.addLevel2Spawns,
    ][num]()
  }
  
  addLevel1Spawns() {
    this.enemiesToSpawn = [
      new Enemy(0, -1200, new RandomMovementAI(1000), imgs.enemy),
      new Enemy(0, -800, new RandomMovementAI(1000), imgs.enemy),
      new Enemy(0, -400, new RandomMovementAI(1000), imgs.enemy),
      new Enemy(0, -400, new RandomMovementAI(1000), imgs.enemy),
    ]
  }
  
  addLevel2Spawns() {
    console.log("lev2")
    this.enemiesToSpawn = [
      new Enemy(0, -1200, new TargettingAI(player), imgs.enemy),
      new Enemy(0, -800, new TargettingAI(player), imgs.enemy),
      new Enemy(0, -400, new TargettingAI(player), imgs.enemy),
      new Enemy(0, -400, new TargettingAI(player), imgs.enemy),
    ]
  }
}
