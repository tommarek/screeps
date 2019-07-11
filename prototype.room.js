var constants = require('constants');

Object.defineProperty(Room.prototype, 'sources', {
    get: function() {
        if (!this._sources) {
            this._sources = this.find(FIND_SOURCES);
        }
        return this._sources;
    },
    enumerable: false,
    configurable: true
});


Room.prototype.getAvailableSpawn = function() {
  let available_spawns = _.filter(Game.spawns, (spawn) => {return spawn.room == this && !spawn.spawning});
  if (available_spawns.length > 0) return available_spawns[0];
  return null;
};


Room.prototype.getSourcesNotMined = function () {
  var ret = [];
  var miners = this.find(FIND_MY_CREEPS, {filter: (s) => s.memory.role == 'miner' && s.memory.sourceId});
  var targetIds = miners.map(m => m.memory.sourceId);

  for (var i in this.sources) {
    var source = this.sources[i];
    if (!targetIds.includes(source.id)) {
      ret.push(source);
    }
  }
  return ret;
}
