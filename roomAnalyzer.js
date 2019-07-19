'use strict';

const RoomAnalyzer = function(roomName) {
  this.roomName = roomName;
  this.room = Game.rooms[this.roomName];

  if (!Memory.rooms[roomName]) Memory.rooms[roomName] = {};
  if (!Memory.rooms[roomName].info) Memory.rooms[roomName].info = {};


  this.memory = Memory.rooms[roomName].intel;
}

RoomAnalyzer.prototype.analyzeRoom = function() {
  const room = Game.rooms[this.roomName];
  if (!room) return;

  this.getControllerInfo()
  this.getResourceInfo();
  this.getTerrainInfo();

}

RoomAnalyzer.prototype.getControllerInfo = function() {
  var controller = this.room.controller;
  if (controller) {
    this.hasController = true;
    this.memory.owner = this.room.controller.owner.username;
    this.roomControlLevel = this.room.controller.level;
    this.memory.ticksToDowngrade = room.controller.ticksToDowngrade;
    this.memory.safemodeAvail = room.controller.safeModeAvailable;
  } else {
    this.hasController = false;
    this.memory.owner = undefined;
  }
}

RoomAnalyzer.prototype.getResourceInfo = function() {
  this.memory.sources = _.map(room.find(FIND_SOURCES), s => {
    return {
      x: s.pos.x,
      y: s.pos.y,
      id: s.id
    }
  });

  const mineral = _.first(room.find(FIND_MINERALS));
  if (mineral) {
    this.memory.mineral = mineral.id;
    this.memory.mineralType = mineral.mineralType;
  } else {
    this.memory.mineral = undefined;
  }
}

RoomAnalyzer.prototype.getTerrainInfo = function() {
  this.memory.exits = Game.map.describeExits(room.name);
  this.memory.terrain = {
    exit: 0,
    plain: 0,
    swamp: 0,
    wall: 0
  };
  const terrain = new Room.Terrain(this.roomName);
  for (let x = 0; x < 50; x++) {
    for (let y = 0; y < 50; y++) {
      let tile = terrain.get(x, y);
      if ((x == 0 || y == 0 || x == 49 || y == 49) && tile !== TERRAIN_MASK_WALL) {
        this.memory.terrain.exit += 1;
      } else if (tile == TERRAIN_MASK_WALL) {
        this.memory.terrain.wall += 1;
      } else if (tile == TERRAIN_MASK_SWAMP) {
        this.memory.terrain.swamp += 1;
      } else {
        this.memory.terrain.plain += 1;
      }
    }
  }
}

RoomAnalyzer.prototype.getCostMatrix = function() {
  if (this.memory.costMatrix) return this.memory.costMatrix;

  if (!this.memory.pathfinding) {
    obstaclesAndRoads = this.room.getObstaclesAndRoads();
    this.memory.pathfinding = {
      obstacles: obstaclesAndRoads.obstacles,
      roads: obstaclesAndRoads.roads,
    }
  }

  this.memory.CostMatrix = new PathFinder.CostMatrix();
  _.each(this.pathfinding.obstacles, obstacle => {
    this.memory.CostMatrix.set(obstacle.pos.x, obstacle.pos.y, 255)
  });
  _.each(this.pathfinding.roads, road => {
    this.memory.CostMatrix.set(obstacle.pos.x, obstacle.pos.y, 1)
  });

  return this.memory.CostMatrix;
}
