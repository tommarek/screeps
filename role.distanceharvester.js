var roleDistanceHarvester = {
  repeatingBody: [WORK, CARRY, CARRY, MOVE, MOVE],
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
      if (creep.room.name == 'W7S18'){
        var source = Game.getObjectById("5bbcac819099fc012e63593b");
        if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
          creep.myMoveTo(source, {
              visualizePathStyle: {
              stroke: '#ffaa00'
            },
          });
        }
      } else {
          var exit = creep.room.findExitTo('W7S18');
          creep.moveTo(creep.pos.findClosestByRange(exit));
      }
    } else {
      if (creep.room.name == creep.memory.home_room.name) {
          var target = creep.findStorage();
          if (target) {
            if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
              creep.myMoveTo(target, {
                visualizePathStyle: {
                stroke: '#ffffff'
              },
            });
          }
        } else {
          let controller = creep.memory.home_room.controller;
          creep.myMoveTo(controller);
        }
      } else {
        var exit = creep.room.findExitTo(creep.memory.home_room.name);
        creep.moveTo(creep.pos.findClosestByRange(exit));
      }
    }
  }
};

module.exports = roleDistanceHarvester;
