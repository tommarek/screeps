var roleHarvester = {
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

    if (!creep.memory.working) {
      var source = creep.findSource();
      if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
        creep.myMoveTo(source, {
          visualizePathStyle: {
            stroke: '#ffaa00'
          },
          maxRooms: 1
        });
      }
    } else {
      var target = creep.findTransferTarget();
      if (target) {
        if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.myMoveTo(target, {
            visualizePathStyle: {
              stroke: '#ffffff'
            },
            maxRooms: 1
          });
        }
      } else {
        let controller = creep.memory.home_room.controller;
        creep.myMoveTo(controller);
      }
    }
  }
};

module.exports = roleHarvester;
