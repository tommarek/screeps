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
      var container = containers[0];
      creep.memory.position = container.pos;
      creep.memory.sourceId = source.id;
      creep.memory.containerId = containers[0].id;

    } else {
      creep.memory.position = spotsAroundSource[0];
      creep.memory.sourceId = source.id;
      creep.memory.containerId = undefined;
    }
  },

  constructor: function() {
    var creep = this.creep;
    var sources = creep.room.getSourcesNotMined();
    if (sources.length > 0) {
      for (let id in sources) {
        if (this.getMiningPosition(sources[id])) {
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
      if (creep.pos.isEqualTo(creep.memory.position.x, creep.memory.position.y)) {
        // TODO this should probably be done by every creep - don't waste resources!
        var droppedEnergy = creep.pos.findInRange(FIND_DROPPED_RESOURCES, 1);
        if (droppedEnergy.length > 0) {
          creep.pickup(droppedEnergy[0]);
        } else {
          creep.harvest(Game.getObjectById(creep.memory.sourceId));
        }
      } else {
        creep.moveTo(creep.memory.position.x, creep.memory.position.y, {
          visualizePathStyle: {
            stroke: '#ffffff'
          },
        });
      }

      let container = Game.getObjectById(creep.memory.containerId);
      if (container.hits < container.hitsMax) creep.repair(container);
      if (creep.carry.energy == creep.carryCapacity) creep.transfer(container, RESOURCE_ENERGY);
    }
  },
};

module.exports = roleMiner;
