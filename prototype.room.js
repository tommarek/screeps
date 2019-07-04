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

Object.defineProperty(Room.prototype, 'availableSpawn', {
    get: function() {
      let available_spawns = _.filter(Game.spawns, (spawn) => spawn.room == this);
      // let available_spawns = _.filter(Game.spawns, (spawn) => {spawn.room == this && spawn.spawning == false};
      if (available_spawns.length > 0) return available_spawns[0];
      return null;
    },
    enumerable: false,
    configurable: true
});


Room.prototype.getAvailableSpawn = function() {
  let available_spawns = _.filter(Game.spawns, (spawn) => spawn.room == this);
  // let available_spawns = _.filter(Game.spawns, (spawn) => {spawn.room == this && spawn.spawning == false};
  if (available_spawns.length > 0) return available_spawns[0];
  return null;
};
