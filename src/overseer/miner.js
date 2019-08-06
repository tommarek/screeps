'use strict';

const utils = require('utils');

const Miner = function(o) {
  this.locationDetails = {}
  this.assignments = {} // {flagName: {miner: miner_name, dumpTruck: dumpTruckName}}

  this.logger = o.getLogger('miner');

  this.initFlags();
  this.placeMiningFlags();
}

/**
 * To be called at the beginning of the program - looks up all the mining flags
 * (COLOR_WHITE) and loads the mining details into this.locationDetails. Also sets
 * all the flags as unassigned.
 **/
Miner.prototype.initFlags = function() {
  const miningFlags = this.getMiningFlags();
  _.each(miningFlags, (flag) => {
    this.loadLocationDetails(flag);
    this.assignments[flag.name] = {
      miner: undefined,
      dumpTruck: undefined
    };
  });
};

/**
 * Finds all the mining flags (COLOR_WHITE)
 **/
Miner.prototype.getMiningFlags = function() {
  return _.filter(Game.flags, flag => flag => flag.color == COLOR_WHITE);
};

/**
 * Searches the flag location for sources and adjacent storages and store these
 * data to the Miner memory.
 * @param {Flag} flag
 *   Flag object that should be directly on a Source
 **/
Miner.prototype.loadLocationDetails = function(flag) {
  const source = _.first(flag.pos.lookFor(LOOK_SOURCES));
  if (!source) return;

  const spotsAroundSource = source.pos.getAdjacentEnterable();
  const container = _.first(source.pos.findInRange(FIND_STRUCTURES, 1, {
    filter: (s) => s.structureType == STRUCTURE_CONTAINER
  }));
  const miningPos = container.pos;
  this.locationDetails[flag.name] = {
    source: source,
    container: container,
    miningPos: miningPos,
  };
}

/**
 * Places a new mining flag (COLOR_WHITE) on a defined spot
 * @param {RoomPosition} pos
 *   Position of the newly created flag
 * @param {String} name
 *   (optional) flag name, if not defined, the flag will be named automatically
 **/
Miner.prototype.placeMiningFlag = function(pos, name = undefined) {
  let flagName = name;
  if (!flagName) {
    flagName = "Mining-" + utils.encodePosition(pos);
  }
  overseer.builder.createFlag(pos, flagName, COLOR_WHITE);
}

/**
 * Places mining flags on all the sources in our rooms. Flags on sources outside
 * of our rooms should be placed manually (TODO: or later using AI).
 **/
Miner.prototype.placeMiningFlags = function() {
  var toBePlaced = [];
  _.each(Game.rooms, (room) => {
    const roomAnalysis = overseer.getRoomAnalysis(room.name);
    if (roomAnalysis.my) {
      _.each(roomAnalysis.memory.sources, (source) => {
        const pos = utils.decodePosition(source.pos);
        const miningFlag = _.first(_.filter(pos.lookFor(LOOK_FLAGS), (f) => {f.color == COLOR_WHITE}));
        if (!miningFlag) toBePlaced.push(pos);
      });
    }
  });

  _.each(toBePlaced, (pos) => {
    this.logger.info('mining flag to be placed ' + utils.encodePosition(pos));
    this.placeMiningFlag(pos)
  });
}


module.exports = Miner;
