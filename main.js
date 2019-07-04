require('prototype.creep');
require('prototype.room');
require('prototype.spawn');

var constants = require('constants');

module.exports.loop = function() {

  for (var name in Memory.creeps) {
    if (!Game.creeps[name]) {
      delete Memory.creeps[name];
      console.log('Clearing non-existing creep memory:', name);
    }
  }


  for (var room_name in Game.rooms) {
    var room = Game.rooms[room_name];

    for (var role_name in constants.roles) {
      var role_details = constants.roles[role_name];
      var creeps = _.filter(Game.creeps, (creep) => creep.memory.role == role_name);

      if (creeps.length < role_details.required) {
        var newName = role_name + Game.time;
        console.log('Spawning new ' + role_name + ': ' + newName);
        let available_spawn = room.getAvailableSpawn();
        if (available_spawn) {
          available_spawn.createCustomCreep(role_details.body, newName, {
            memory: {
              role: role_name,
              home_room: room,
            }
          });
        }
      }
    }
  }

  // var tower = Game.getObjectById('TOWER_ID');
  // if (tower) {
  //   var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
  //     filter: (structure) => structure.hits < structure.hitsMax
  //   });
  //   if (closestDamagedStructure) {
  //     tower.repair(closestDamagedStructure);
  //   }
  //
  //   var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
  //   if (closestHostile) {
  //     tower.attack(closestHostile);
  //   }
  // }

  if (Game.spawns['Spawn1'].spawning) {
    var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
    Game.spawns['Spawn1'].room.visual.text(
      '🛠️' + spawningCreep.memory.role,
      Game.spawns['Spawn1'].pos.x + 1,
      Game.spawns['Spawn1'].pos.y, {
        align: 'left',
        opacity: 0.8
      });
  }

  for (var name in Game.creeps) {
    var creep = Game.creeps[name];
    creep.runRole();
  }
}
