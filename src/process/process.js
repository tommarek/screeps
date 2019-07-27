'use strict';

const Process = function(params) {
  this.params = params;
}

Process.prototype.shouldRun = function() {
  return true;
}

Process.prototype.run = function() {
  console.error('Running process `' + this.id + '` without any functionality.');
}

module.exports = Process;
