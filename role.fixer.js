var roleFixer = {
  run: function(creep) {

    if (creep.memory.working && creep.carry.energy == 0) {
      creep.memory.working = false;
      creep.say('harvest');
    }
    if (!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
      creep.memory.working = true;
      creep.say('work');
    }

    let target;
    if (creep.memory.working) {
      target = creep.findRepair() || creep.findConstruction();
    } else {
      target = creep.findSource();
    }
    if (target) {
      if (creep.doTask(target) == ERR_NOT_IN_RANGE) {
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
