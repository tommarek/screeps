'use strict';

const Builder = function(o) {
  this.memory = {};

  this.buildQueue = {};
  this.flagsToMove = {};

  this.logger = o.getLogger('builder');
}

/**
 * Flag creation takes two steps - first the flag is crated in a room we can see
 * afterwards in the next tick the flag can be moved anywhere on a map. Weird...
 * @param {RoomPosition} pos
 *   desired location of the flags
 * @param {String} name
 *   name of the flag
 * @param {String} color
 *   desired color of the flag
 * @param {String} secondaryColor
 *   desired secondary color of the flag
 **/
Builder.prototype.createFlag = function(pos, name, color, secondaryColor = undefined) {
  const room = Game.rooms[Object.keys(Game.rooms)[0]];
  room.createFlag(1, 1, name, color, secondaryColor);
  this.flagsToMove[name] = pos;
}

/**
 * Iterates through all the flags created in last tick and moves them to the
 * desired location
 **/
Builder.prototype.moveFlags = function() {
  _.each(overseer.builder.flagsToMove, (pos, flagName) => {
    Game.flags[flagName].setPosition(pos);
    delete overseer.builder.flagsToMove[flagName];
  });
}

/**
 * Build all object in the queue
 **/
Builder.prototype.build = function() {
  var newBuildQueue = {}
  _.each(this.buildQueue, (roomName) => {
    const room = Game.rooms[roomName];
    newBuildQueue[roomName] = [];
    _.each(this.buildQueue[roomName], (obj) => {
      const ret = room.createConstructionSite(obj.pos, obj.structureType, obj.name);
      if (ret !== OK) {
        this.buildQueue[roomName].push(obj);
      }
    });
  });
  this.buildQueue = newBuildQueue;
}

/**
 * Add a new construction site to build buildQueue
 * @param {RoomPosition} pos
 *   position of the newly created construction site
 * @param {String} structureType
 *   one of the STRUCTURE_* constants.
 * @param {String} name
 *   the name of the structure, for structures that support it (currently only spawns).
 **/
Builder.prototype.buildStructure = function(pos, structureType, name = undefined) {
  roomName = pos.roomName
  if (!this.buildQueue[roomName]) this.buildQueue[roomName] = [];

  this.buildQueue[roomName].push({
    pos: pos,
    structureType: structureType,
    name: name,
  });
}


module.exports = Builder;
