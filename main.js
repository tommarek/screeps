'use strict';

require('prototype.creep');
require('prototype.room');
require('prototype.spawn');
require('prototype.roomposition');

var constants = require('constants');

const Overseer = require('overseer');
global.overseer = new Overseer();


module.exports = {
  loop() {
    //optionally add a profiler here
    this.run();
  },

  run() {
    overseer.initTick();

    this.clean();

    overseer.runProcess(constants.processes.INIT, constants.processes.INIT, {});
    overseer.runProcess(constants.processes.CREEPS, constants.processes.CREEPS, {});

    // OLD stuff

    for (var roomName in Game.rooms) {
      var room = Game.rooms[roomName];
      var logger = overseer.getLogger('default', roomName);

      for (var roleName in constants.roles) {
        var roleDetails = constants.roles[roleName];
        var creeps = _.filter(Game.creeps, (creep) => creep.memory.role == roleName);

        if (creeps.length < roleDetails.required) {
          var newName = roleName + Game.time;
          let available_spawn = room.getAvailableSpawn();
          if (available_spawn) {
            let newBody = available_spawn.genBody(roleDetails.body.repeating, roleDetails.body.fixed, 300)
            logger.info('Spawning new ' + roleName + ': ' + newName + 'body: ' + newBody);
            var exitCode = available_spawn.spawnCreep(newBody, newName, {
              memory: {
                role: roleName,
                home_room: room,
              }
            });
            if (exitCode == OK) break;
          }
        }
      }

      // TOOD: find all towers!(prototype.game.js)
      var towers = room.find(FIND_MY_STRUCTURES, {
        filter: {
          structureType: STRUCTURE_TOWER
        }
      });
      for (var tid in towers) {
        var tower = towers[tid];
        if (tower) {
          var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
          if (closestHostile) {
            tower.attack(closestHostile);
          } else if (tower.energy > tower.energyCapacity / 2) {
            var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
              filter: (structure) => structure.hits < structure.hitsMax && structure.hits < 2000000
            });
            if (closestDamagedStructure) {
              tower.repair(closestDamagedStructure);
            }
          }
        }
      }
    }

    if (Game.spawns['Spawn1'].spawning) {
      var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
      Game.spawns['Spawn1'].room.visual.text(
        'spawning' + spawningCreep.memory.role,
        Game.spawns['Spawn1'].pos.x + 1,
        Game.spawns['Spawn1'].pos.y, {
          align: 'left',
          opacity: 0.8
        }
      );
    }
  },

  clean() {
    for (var name in Memory.creeps) {
      if (!Game.creeps[name]) {
        delete Memory.creeps[name];
        console.log('Clearing non-existing creep memory:', name);
      }
    }
  },
}
