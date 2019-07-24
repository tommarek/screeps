'use strict';

const Process = require('./process');

const ProcessInit = function(params) {
  Process.call(params);
}

ProcessInit.prototype = Object.create(Process.prototype);

ProcessInit.prototype.run = function() {
    Game.creepsByRole = {};
    _.each(Game.creeps, creep => creep.initCreep());
}

module.exports = ProcessInit;
