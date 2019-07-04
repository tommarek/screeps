StructureSpawn.prototype.createCustomCreep = function(body, name, memory) {
  if (this.spawning) {
    return true;
  }

  if (!Game.creeps[name]) {
    this.spawnCreep(body, name, memory);
  }
};
