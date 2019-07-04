StructureSpawn.prototype.createCustomCreep = function(name, body, memory) {
  if (this.spawning) return true;

  let room = this.room;

  if (!Game.creeps[name]) {
    this.room.visual.text('🛠️' + spawningCreep.memory.role, this.pos.x + 1, this.pos.y, {
      align: 'left',
      opacity: 0.8
    });
  }
};
