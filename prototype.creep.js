var constants = require('constants');

Creep.prototype.runRole = function() {
  constants.roles[this.memory.role].code.run(this)
};

Creep.prototype.findSource = function() {
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

Creep.prototype.setLastPosition = function() {
  this.memory.lastPosition = this.pos;
};

Creep.prototype.isStuck = function() {
  return !(this.memory.lastPosition == this.pos);
};



Creep.prototype.findRepair = function() {
  return this.pos.findClosestByRange(FIND_STRUCTURES, {
    filter: (s) => s.hits < constants.repairThreshold*s.hitsMax
  });
};

Creep.prototype.findBattleRepair = function() {
  return this.pos.findClosestByRange(FIND_STRUCTURES, {
      filter: (s) => ((s.structureType === STRUCTURE_RAMPART && s.hits < constants.repairThreshold*s.hitsMax) || (s.structureType === STRUCTURE_WALL && s.hits < constants.repairThreshold*s.hitsMax))
    });
};

Creep.prototype.findConstruction = function() {
  return this.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
};

// Movement
Creep.prototype.myMoveTo = function(target, opts={}, fix=true) {
  this.moveTo(target, opts);
  if (fix) this.repair(this.findRepair());
}

// Creep.prototype.moveToMem = function(target, opts={}) {
//   if (this.pos == target.pos) {
//       console.log(this.name + ': on the position');
//       return OK;
//   }

//   else if (!this.memory.movement || this.memory.movement.target.id != target.id || this.isStuck()) {
//     console.log(this.name + ': stuck, this_pos: '+this.pos);
//     this.memory.movement = {target:target, path: null};
//   }

//   if (!this.memory.movement.path) {
//     console.log(this.name + ': finding new path');
//     this.memory.movement.path = this.pos.findPathTo(target, opts);
//   }

//   this.setLastPosition();
//   console.log(this.name + ': moving, last_pos: '+this.lastPosition);
//   return this.moveByPath(this.memory.movement.path)
// }
