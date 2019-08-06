'use strict';

const utils = require('utils');

const RoomAnalyzer = function(roomName) {
  this.roomName = roomName;
  this.room = Game.rooms[this.roomName];

  if (!Memory.rooms) Memory.rooms = {};
  if (!Memory.rooms[roomName]) Memory.rooms[roomName] = {};
  if (!Memory.rooms[roomName].RoomAnalysis) Memory.rooms[roomName].RoomAnalysis = {};

  this.memory = Memory.rooms[roomName].RoomAnalysis;
}

RoomAnalyzer.prototype.analyzeRoom = function() {
  this.room = Game.rooms[this.roomName];
  if (!this.room) return;

  this.getControllerInfo()
  this.getResourceInfo();
  this.getTerrainInfo();

}

RoomAnalyzer.prototype.getControllerInfo = function() {
  var controller = this.room.controller;
  if (controller) {
    this.hasController = true;
    this.memory.owner = this.room.controller.owner.username;
    this.my = this.room.controller.my;
    this.roomControlLevel = this.room.controller.level;
    this.memory.ticksToDowngrade = this.room.controller.ticksToDowngrade;
    this.memory.safemodeAvail = this.room.controller.safeModeAvailable;
  } else {
    this.hasController = false;
    this.memory.owner = undefined;
  }
}

RoomAnalyzer.prototype.getResourceInfo = function() {
  // find sources
  this.memory.sources = _.map(this.room.find(FIND_SOURCES), s => {
    return {
      pos: utils.encodePosition(s.pos),
      id: s.id
    }
  });

  const mineral = _.first(this.room.find(FIND_MINERALS));
  if (mineral) {
    this.memory.mineral = {
      id: mineral.id,
      pos: utils.encodePosition(mineral.pos),
      mineralType: mineral.mineralType,
    };
  } else {
    this.memory.mineral = undefined;
  }

  this.memory.tombstones = _.map(this.room.find(FIND_TOMBSTONES), ts => {
    return {
      pos: utils.encodePosition(ts.pos),
      id: ts.id,
      ticksToDecay: ts.ticksToDecay,
      store: ts.store,
    }
  });

  this.memory.droppedResources = _.reduce(this.room.find(FIND_DROPPED_RESOURCES), (result, value, key) => {
    (result[value.resourceType] || (result[value.resourceType] = [])).push({
      pos: utils.encodePosition(value.pos),
      id: value.id,
      amount: value.amount,
      ticksToDecay: utils.calcResourceTTD(value.amount),
    });
    return result;
  });

}

RoomAnalyzer.prototype.getTerrainInfo = function() {
  this.memory.exits = Game.map.describeExits(this.room.name);
  this.memory.terrain = {
    exit: 0,
    plain: 0,
    swamp: 0,
    wall: 0
  };
  const terrain = new Room.Terrain(this.room.name);
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

module.exports = RoomAnalyzer;
