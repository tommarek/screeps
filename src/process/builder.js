'use strict';

const Process = require('./process.process');

const ProcessBuilder = function(params) {
  Process.call(params);
}

ProcessBuilder.prototype = Object.create(Process.prototype);


ProcessBuilder.prototype.run = function() {
  overseer.tasker.getMissingCreeps();
  overseer.runSubprocess('move-flags', overseer.builder.moveFlags);
  overseer.runSubprocess('build', overseer.builder.build);
}

module.exports = ProcessBuilder;
