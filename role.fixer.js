var roleFixer = {
  run: function(creep) {

    if (creep.memory.working && creep.carry.energy == 0) {
      if (creep.memory.target && creep.memory.target.hits == creep.memory.target.hitsMax) creep.memory.target = null;
      creep.memory.working = false;
      creep.say('🔄 harvest');
    }
    if (!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
      creep.memory.working = true;
      creep.say('🚧 work');
    }

    if (creep.memory.working) {
      // repair first - if we've already repaired something
      let target = null;
      if (creep.memory.target && creep.memory.target.hits != creep.memory.target.hitMax) {
        target = creep.memory.target;
      } else {
        target = creep.findRepair() || target.findConstruction();
      }
      if (target) {
        if (creep.repair(target) == ERR_NOT_IN_RANGE) {
          creep.moveTo(target, {
            visualizePathStyle: {
              stroke: '#ffffff'
            },
            maxRooms: 1
          });
        }
      }
    } else {
      let target = creep.findSource();
      if (creep.harvest(target) == ERR_NOT_IN_RANGE) {
        creep.moveTo(target, {
          visualizePathStyle: {
            stroke: '#ffaa00'
          },
          maxRooms: 1
        });
      }
    }
  },

  genBody: function(creep) {
    // here we will generate body parts based on the
  }
};

module.exports = roleFixer;
