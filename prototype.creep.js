var constants = require('constants');

Creep.prototype.registerCreep = function() {
  if (!Game.creepsByRole[this.memory.role]) Game.creepsByRole[this.memory.role] = {};
  Game.creepsByRole[this.memory.role][this.name] = this.id;

  if (!this.room.creepsByRole) this.room.creepsByRole = {};
  if (!this.room.creepsByRole[this.role]) this.room.creepsByRole[this.memory.role] = {};
  this.room.creepsByRole[this.memory.role][this.name] = this.id;
}


Creep.prototype.doTask = function(target) {
  if (this.memory.task == 'build') return this.build(target);
  if (this.memory.task == 'repair') return this.repair(target);
  if (this.memory.task == 'harvest') return this.harvest(target);
  if (this.memory.task == 'withdraw_energy') return this.withdraw(target, RESOURCE_ENERGY);
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

// move these to roles
Creep.prototype.findTransferTarget = function(structureTypes = [STRUCTURE_SPAWN, STRUCTURE_EXTENSION, STRUCTURE_TOWER]) {
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

Creep.prototype.findRepair = function(structureTypes = undefined) {
  this.memory.task = 'repair';
  var target;
  if (structureTypes) {
    for (var i in structureTypes) {
      target = this.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: (s) => s.structureType == structureTypes[i] && s.hits < constants.repairThreshold * s.hitsMax && s.hits < 3000000
      });
      if (target) return target;
    }
  } else {
    return this.pos.findClosestByRange(FIND_STRUCTURES, {
      filter: (s) => s.hits < constants.repairThreshold * s.hitsMax && s.hits < 3000000
    });
  }
};

Creep.prototype.findBattleRepair = function() {
  this.memory.task = 'repair';
  return this.pos.findClosestByRange(FIND_STRUCTURES, {
    filter: (s) => ((s.structureType === STRUCTURE_RAMPART && s.hits < constants.repairThreshold * s.hitsMax) || (s.structureType === STRUCTURE_WALL && s.hits < constants.repairThreshold * s.hitsMax))
  });
};

Creep.prototype.findConstruction = function() {
  this.memory.task = 'build';
  return this.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
};

Creep.prototype.findStorage = function() {
  this.memory.task = 'withdraw_energy';
  return this.room.storage;
}

// Movement
Creep.prototype.setLastPosition = function() {
  this.memory.lastPosition = this.pos;
};

Creep.prototype.isStuck = function() {
  return !(this.memory.lastPosition == this.pos);
};

// TODO: do not try to come up with a new path every single tick - only when stuck
Creep.prototype.myMoveTo = function(target, opts = {}) {
  this.moveTo(target, opts);
  if (constants.walkAndRepair) {
    var target = this.findRepair([STRUCTURE_ROAD, STRUCTURE_TOWER]);
    this.repair(target);
  }
}
