var roleBuilder = {
  run: function(creep) {

    if (creep.memory.working && creep.carry.energy == 0) {
      creep.memory.working = false;
      creep.say('🔄 harvest');
    }
    if (!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
      creep.memory.working = true;
      creep.say('🚧 work');
    }

    if (creep.memory.working) {
      target = creep.findConstruction() || creep.findRepair();
      if (target) {
        if (creep.build(target) == ERR_NOT_IN_RANGE) {
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

module.exports = roleBuilder;
