'use strict';

const Process = require('./process.process');

const ProcessMiner = function(params) {
  Process.call(params);

  this.logger = overseer.getLogger('miner');
}

ProcessMiner.prototype = Object.create(Process.prototype);


ProcessMiner.prototype.run = function() {
  overseer.tasker.getMissingCreeps();
  overseer.runSubprocess('move-flags', overseer.builder.moveFlags);
  overseer.runSubprocess('build', overseer.builder.build);
}

module.exports = ProcessMiner;
