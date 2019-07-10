var roleFixer = {
  repeatingBody: [WORK, WORK, CARRY, CARRY, MOVE],
  fixedBody: [WORK, CARRY, MOVE],
  run: function() {
    var creep = this.creep;

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
};

module.exports = roleFixer;
