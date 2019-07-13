var roleDumpTruck = {
  repeatingBody: [CARRY, CARRY, MOVE],
  fixedBody: [WORK, CARRY, MOVE],

  constructor: function() {
    var creep = this.creep;
    creep.memory.state = 'load';

    var sourceIds = creep.room.sources.map(m => m.id);
    var assignedSourceIds = creep.room.find(FIND_MY_CREEPS, {
      filter: (s) => s.memory.role == 'dumptruck' && s.memory.sourceId
    }).map(m => m.memory.sourceId);

    var unassignedSourceIds = sourceIds.filter(x => !assignedSourceIds.includes(x));
    if (unassignedSourceIds.length > 0) {
      creep.memory.sourceId = unassignedSourceIds[0];
      var source = Game.getObjectById(unassignedSourceIds[0]);
      var containers = source.pos.findInRange(FIND_STRUCTURES, 2, {
        filter: (s) => s.structureType == STRUCTURE_CONTAINER
      });
      if (containers.length > 0) {
        creep.memory.containerId = containers[0].id;
      } else {
        creep.memory.containerId = undefined;
      }
    }
  },

  run: function() {
    var creep = this.creep;
    var container = Game.getObjectById(creep.memory.containerId);

    if (!creep.memory.sourceId) {
      this.constructor();
    } else {
      if (creep.memory.state == 'load') {
        if (creep.carry.energy == creep.carryCapacity) {
          creep.memory.state = 'dump';
        } else {
          var droppedEnergy = creep.pos.findInRange(FIND_DROPPED_RESOURCES, 1);
          if (droppedEnergy.length > 0) {
            creep.pickup(droppedEnergy[0]);
          } else {
            if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
              creep.myMoveTo(container);
            }
          }
        }
      } else {
        var storage = creep.room.storage;
        if (creep.transfer(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.myMoveTo(storage);
        }
        if (creep.carry.energy == 0) {
          creep.memory.state = 'load';
        }
      }
    }
  },
};

module.exports = roleDumpTruck;
