var roleBuilder = {
  repeatingBody: [WORK, WORK, CARRY, CARRY, MOVE],
  fixedBody: [WORK, CARRY, MOVE],
  run: function() {
    var creep = this.creep;

    if (creep.memory.working && creep.carry.energy == 0) {
      creep.memory.working = false;
      creep.say('withdraw');
    }
    if (!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
      creep.memory.working = true;
      creep.say('work');
    }

    let target;
    if (creep.memory.working) {
      target = creep.findConstruction() || creep.findRepair();
    } else {
      target = creep.findStorage();
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

module.exports = roleBuilder;
