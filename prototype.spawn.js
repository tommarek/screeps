StructureSpawn.prototype.createCustomCreep = function(body, name, memory) {
  if (this.spawning) {
    return true;
  }

  if (!Game.creeps[name]) {
    this.spawnCreep(body, name, memory);
  }
};

StructureSpawn.prototype.genBody = function(weights=null, costLimit=this.room.energyAvailable) {
  if (!weights) return undefined;
  for (var bodyPart in constants.body_parts_prices) {
    if (priority[bodyPart]) {

    }
  }
}
