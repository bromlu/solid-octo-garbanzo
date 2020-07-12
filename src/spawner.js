import { Enemy } from './enemy';
import { Obstacles } from './obstacles'
import { camera, player, enemies, island } from './main'
import { RandomMovementAI, PatrolAI, TargettingAI } from './AI'
import { imgs } from './load';
import { enemyTypes, MAPW } from './globals'

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
      // console.log(camera.yAnchor, nextEnemy)
      enemies.push(this.enemiesToSpawn.pop());
    }
  }

  updateObstacles() {
    let obstacle = this.obstaclesToSpawn[this.obstaclesToSpawn.length - 1];
    if (!obstacle) return;
    if (camera.yAnchor - 100 <= obstacle.y) {
      obstacles.push(this.obstaclesToSpawn.pop());
    }
  }

  addSpawnsForLevel(num) {
    [
      null,
      this.addLevel1Spawns,
      this.addLevel2Spawns,
      this.addLevel3Spawns,
      this.addLevel4Spawns,
    ][num].call(this)
  }
  
  addLevel1Spawns() {
    this.obstaclesToSpawn = [
      new Obstacles(-1050, -1445, enemyTypes.rock),
      new Obstacles(-923, -1424, enemyTypes.rock),
      new Obstacles(-812, -1478, enemyTypes.rock),
      new Obstacles(-712, -1476, enemyTypes.rock),
      new Obstacles(-623, -1478, enemyTypes.rock),
      new Obstacles(-533, -1405, enemyTypes.rock),
      new Obstacles(-447, -1452, enemyTypes.rock),
      new Obstacles(-342, -1478, enemyTypes.rock),
      new Obstacles(-242, -1475, enemyTypes.rock),
      new Obstacles(-122, -1423, enemyTypes.rock),
      new Obstacles(0, -1400, enemyTypes.rock),
      new Obstacles(198, -1400, enemyTypes.rock),
      new Obstacles(200, -1400, enemyTypes.rock),
      new Obstacles(385, -1400, enemyTypes.rock),
      new Obstacles(578, -1400, enemyTypes.rock),
      new Obstacles(-688, -1000, enemyTypes.seaweed),
      new Obstacles(-550, -1050, enemyTypes.seaweed),
      new Obstacles(-458, -1050, enemyTypes.seaweed),
      new Obstacles(-350, -1050, enemyTypes.seaweed),
      new Obstacles(-288, -1010, enemyTypes.seaweed),
      new Obstacles(-150, -1050, enemyTypes.seaweed),
      new Obstacles(10, -1010, enemyTypes.seaweed),
      new Obstacles(170, -1070, enemyTypes.seaweed),
      new Obstacles(280, -1080, enemyTypes.seaweed),
      new Obstacles(310, -1010, enemyTypes.seaweed),
      new Obstacles(420, -1020, enemyTypes.seaweed),
      new Obstacles(540, -1040, enemyTypes.seaweed),
      new Obstacles(620, -1020, enemyTypes.seaweed),
      new Obstacles(740, -1040, enemyTypes.seaweed),
      new Obstacles(860, -1060, enemyTypes.seaweed),
      new Obstacles(940, -1040, enemyTypes.seaweed),
      new Obstacles(1050, -1050, enemyTypes.seaweed),
      new Obstacles(-1022, -545, enemyTypes.rock),
      new Obstacles(-900, -535, enemyTypes.rock),
      new Obstacles(-887, -545, enemyTypes.rock),
      new Obstacles(-700, -521, enemyTypes.rock),
      new Obstacles(-607, -545, enemyTypes.rock),
      new Obstacles(-500, -521, enemyTypes.rock),
      new Obstacles(-478, -557, enemyTypes.rock),
      new Obstacles(-358, -578, enemyTypes.rock),
      new Obstacles(-200, -521, enemyTypes.rock),
      new Obstacles(-100, -562, enemyTypes.rock),
      new Obstacles(0, -524, enemyTypes.rock),
      new Obstacles(175, -542, enemyTypes.rock),
      new Obstacles(278, -504, enemyTypes.rock),
      new Obstacles(325, -556, enemyTypes.rock),
      new Obstacles(400, -504, enemyTypes.rock),
      new Obstacles(575, -545, enemyTypes.rock),
    ]
  }
  
  addLevel2Spawns() {
    console.log("lev2")
    this.enemiesToSpawn = [
      ...generateMantas(10)
    ]
    this.obstaclesToSpawn = [
      ...generateRocks(100),
      ...generateSeaweed(100),
      ...generateKrakens(5)
    ]
    this.enemiesToSpawn = this.enemiesToSpawn.sort(function(a,b) { 
      return a.y - b.y }
    )
    this.obstaclesToSpawn = this.obstaclesToSpawn.sort(function(a,b) { return a.y - b.y } )

    console.log(this.enemiesToSpawn)
  }
  addLevel3Spawns() {
    console.log("lev3")
    this.enemiesToSpawn = [
      ...generateTargeting(5),
      ...generateMantas(15),
      ...generatePatrols(15)
    ]
    this.obstaclesToSpawn = [
      ...generateRocks(100),
      ...generateSeaweed(100),
      ...generateKrakens(10)
    ]
    this.enemiesToSpawn = this.enemiesToSpawn.sort(function(a,b) {  return a.y - b.y })
    this.obstaclesToSpawn = this.obstaclesToSpawn.sort(function(a,b) { return a.y - b.y } )

  }
  addLevel4Spawns() {
    console.log("lev4")
    this.enemiesToSpawn = [
      ...generateTargeting(10),
      ...generateMantas(20),
      ...generatePatrols(20)
    ]
    this.obstaclesToSpawn = [
      ...generateRocks(150),
      ...generateSeaweed(150),
      ...generateKrakens(40)
    ]
    this.enemiesToSpawn = this.enemiesToSpawn.sort(function(a,b) {  return a.y - b.y })
    this.obstaclesToSpawn = this.obstaclesToSpawn.sort(function(a,b) { return a.y - b.y } )

  }
}

function generateRocks(n) {
  let arr = [];
  for (let i = 0; i < n; i++) {
    arr.push(new Obstacles(Math.random() * MAPW - MAPW/2, Math.random() * (island.y + 100) - 100, enemyTypes.rock))
  }
  return arr
}

function generateSeaweed(n) {
  let arr = [];
  for (let i = 0; i < n; i++) {
    arr.push(new Obstacles(Math.random() * MAPW - MAPW/2, Math.random() * (island.y + 100) - 100, enemyTypes.seaweed))
  }
  return arr
}

function generateKrakens(n) {
  let arr = [];
  for (let i = 0; i < n; i++) {
    arr.push(new Obstacles(Math.random() * MAPW, Math.random() * (island.y + 100) - 100, enemyTypes.kraken))
  }
  return arr
}

function generateMantas(n) {
  let arr = [];
  for (let i = 0; i < n; i++) {
    arr.push(new Enemy(Math.random() * MAPW, Math.random() * (island.y + 100) - 100, new RandomMovementAI(1000), enemyTypes.manta))
  }
  return arr
}

function generatePatrols(n) {
  let arr = [];
  for (let i = 0; i < n; i++) {
    arr.push(new Enemy(Math.random() * MAPW, Math.random() * (island.y + 100) - 100, new PatrolAI(1000), enemyTypes.manta))
  }
  return arr
}

function generateTargeting(n) {
  let arr = [];
  for (let i = 0; i < n; i++) {
    arr.push(new Enemy(Math.random() * MAPW, Math.random() * (island.y + 100) - 100, new TargettingAI(player), enemyTypes.boat))
  }
  return arr
}