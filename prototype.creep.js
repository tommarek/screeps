var constants = require('constants');

Creep.prototype.runRole = function() {
  constants.roles[this.memory.role].code.run(this)
};

Creep.prototype.doTask = function(target) {
    if (this.memory.task == 'build') return this.build(target);
    if (this.memory.task == 'repair') return this.repair(target);
    if (this.memory.task == 'harvest') return this.harvest(target);
}

Creep.prototype.genBody = function(priority={}) {
  for (var bodyPart in constants.body_parts_prices) {

  }
}

Creep.prototype.findSource = function() {
  this.memory.task = 'harvest';
  var source = this.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
  if (source) {
    if (this.moveTo(source) !== ERR_NO_PATH) {
      if (source.id) {
        this.memory.source = source.id;
        return source;
      }
    }
  }
  return null;
};

Creep.prototype.findTransferTarget = function(structureTypes=[STRUCTURE_SPAWN, STRUCTURE_EXTENSION, STRUCTURE_TOWER]) {
  this.memory.task = 'transfer';
  var target = undefined;
  for (var i in structureTypes) {
    target = this.pos.findClosestByRange(FIND_STRUCTURES, {
      filter: (s) => s.structureType == structureTypes[i] && s.energy < s.energyCapacity
    });
    if (target) return target;
  }
  return target;
};

Creep.prototype.findRepair = function(structureTypes=undefined) {
  this.memory.task = 'repair';
  var target;
  if (structureTypes) {
    for (var i in structureTypes) {
      target = this.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: (s) => s.structureType == structureTypes[i] && s.hits < constants.repairThreshold*s.hitsMax
      });
      if (target) return target;
    }
  } else {
    return this.pos.findClosestByRange(FIND_STRUCTURES, {
      filter: (s) => s.hits < constants.repairThreshold*s.hitsMax
    });
  }
};

Creep.prototype.findBattleRepair = function() {
  this.memory.task = 'repair';
  return this.pos.findClosestByRange(FIND_STRUCTURES, {
      filter: (s) => ((s.structureType === STRUCTURE_RAMPART && s.hits < constants.repairThreshold*s.hitsMax) || (s.structureType === STRUCTURE_WALL && s.hits < constants.repairThreshold*s.hitsMax))
    });
};

Creep.prototype.findConstruction = function() {
  this.memory.task = 'build';
  return this.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
};

// Movement
Creep.prototype.setLastPosition = function() {
  this.memory.lastPosition = this.pos;
};

Creep.prototype.isStuck = function() {
  return !(this.memory.lastPosition == this.pos);
};

// do not try to come up with a new path every single tick - only when stuck
Creep.prototype.myMoveTo = function(target, opts={}) {
  this.moveTo(target, opts);
  if (constants.walkAndRepair) {
      var target = this.findRepair([STRUCTURE_ROAD, STRUCTURE_TOWER]);
      this.repair(target);
  }
}
