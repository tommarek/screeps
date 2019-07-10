require('prototype.roomposition');


var roleMiner = {
  repeatingBody: [WORK],
  fixedBody: [WORK, CARRY, MOVE],

  getMiningPosition: function(source) {
    var creep = this.creep;
    var spotsAroundSource = source.pos.getAdjacentxEnterable();

    var containers = source.pos.findInRange(FIND_STRUCTURES, 1, {
      filter: (s) => s.structureType == STRUCTURE_CONTAINER
    });
    if (containers.length > 0) {
      for (i in containers) {
        var spotsAroundContainer = containers[i].pos.getAdjacentxEnterable();
        for (var sid in spotsAroundSource) {
          for (var cid in spotsAroundContainer) {
            if (spotsAroundSource[sid].isEqualTo(spotsAroundContainer[cid])) {
              creep.memory.position = spotsAroundSource[sid];
              creep.memory.sourceId = source.id;
              creep.memory.containerId = containers[i].id;
              creep.memory.primaryHaulerId = null;
            }
          }
        }
      }
    } else {
      creep.memory.position = spotsAroundSource[0];
      creep.memory.sourceId = source.id;
      creep.memory.containerId = undefined;
      creep.memory.primaryHaulerId = null;
    }
  },

  constructor: function() {
    var creep = this.creep;
    var sources = creep.room.getSourcesNotMined();
    if (sources.length > 0) {
      for (let id in sources) {
        if (this.getMiningPosition(creep, sources[id])) {
          creep.say('Initialisation Success')
          break;
        }
      }
    } else {
      creep.say('No source to mine')
    }
  },

  run: function() {
    var creep = this.creep;
    if (!creep.memory.sourceId) {
      this.constructor();
    } else {
      let container = Game.getObjectById(creep.memory.containerId);
      if (creep.pos.isEqualTo(creep.memory.position.x, creep.memory.position.y)) {
        creep.harvest(Game.getObjectById(creep.memory.sourceId))
      } else {
        creep.moveTo(creep.memory.position.x, creep.memory.position.y, {
          visualizePathStyle: {
            stroke: '#ffffff'
          },
        });
      }

      if (container.hits < container.hitsMax) creep.repair(container);
      if (creep.carry.energy == creep.carryCapacity) creep.transfer(container, RESOURCE_ENERGY);
    }
  },

  destructor: function() {
    var creep = this.creep;


  }
};

module.exports = roleMiner;
