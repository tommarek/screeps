var constants = require('constants');

module.exports = function () {
    Room.prototype.getAvailableSpawn = function () {
        let available_spawns = _.filter(Game.spawns, (spawn) => spawn.room == this);
        // let available_spawns = _.filter(Game.spawns, (spawn) => {spawn.room == this && spawn.spawning == false};
        if (available_spawns.length > 0) return available_spawns[0];
        return null;
    };
};
