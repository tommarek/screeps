var rolePrimaryHauler = {
  repeatingBody: [CARRY, CARRY, MOVE],
  fixedBody: [WORK, CARRY, MOVE],

  constructor: function() {
    var creep = this.creep;

    var minersWithoutHaulers = this.room.find(FIND_MY_CREEPS, {
      filter: (s) => s.memory.role == 'miner' && !s.memory.primaryHaulerId
    });

    if (minersWithoutHaulers.length > 0) {
      var miner = minersWithoutHaulers[0];
      creep.memory.minerId = miner.id;
      creep.memory.containerId = miner.memory.containerId;
    } else {
      creep.memory.minerId = null;
      creep.memory.containerId = null;
    }
  }

  run: function() {
    var creep = this.creep;
    if (!creep.memory.sourceId) {}
  },

  destructor: function() {
    var creep = this.creep;
    var assignedMiner = Game.getObjectById(this.memory.minerId);
    assignedMiner.memory.primaryHaulerId = null;
    assignedMiner.memory.primaryHalerNeeded = true;
  }
};

module.exports = rolePrimaryHauler;
