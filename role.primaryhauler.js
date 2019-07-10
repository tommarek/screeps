var rolePrimaryHauler = {
  repeatingBody: [WORK, WORK, CARRY, CARRY, MOVE],
  fixedBody: [WORK, CARRY, MOVE],
  run: function() {
    var creep = this.creep;
    if (!creep.memory.sourceId) {}
  }
};

module.exports = rolePrimaryHauler;
