var roleHarvester = {
  run: function(creep) {
    if (creep.memory.working && creep.carry.energy == 0) {
      creep.memory.working = false;
      creep.say('🔄 harvest');
    }
    if (!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
      creep.memory.working = true;
      creep.say('🚧 work');
    }

    if (!creep.memory.working) {
      var source = creep.findSource();
      if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
        creep.myMoveTo(source, {
          visualizePathStyle: {
            stroke: '#ffaa00'
          },
          maxRooms: 1
        }, false);
      }
    } else {
      var targets = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
          return (structure.structureType == STRUCTURE_EXTENSION ||
              structure.structureType == STRUCTURE_SPAWN ||
              structure.structureType == STRUCTURE_TOWER) &&
            structure.energy < structure.energyCapacity;
        }
      });
      if (targets.length > 0) {
        if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.myMoveTo(targets[0], {
            visualizePathStyle: {
              stroke: '#ffffff'
            },
            maxRooms: 1
          },false);
        }
      } else {
        let controller = creep.memory.home_room.controller;
        creep.moveTo(controller);
      }
    }
  }
};

module.exports = roleHarvester;
