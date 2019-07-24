'use strict';

const Process = require('./process');
const DTCreeps = require('decisionTree.creeps')

const ProcessTasker = function(params) {
  Process.call(params);
}

ProcessTasker.prototype = Object.create(Process.prototype);


ProcessTasker.prototype.run = function() {
    overseer.runSubprocess('run-creeps', this.executeAssignedTasks());
    overseer.runSubprocess('assign-creeps', this.assignNewTasks());
}

ProcessTasker.prototype.executeAssignedTasks = function() {
  _.each(overseer.tasker.assignedTasks, (task, creepName) => {
    const ret = task.execute();
    if (task.taskEnded) overseer.tasker.moveCreepToUnassigned(creepName);
  })
}

ProcessTasker.prototype.assignNewTasks = function(creep) {
  const RoomAnalysis = overseer.getRoomAnalysis(creep.room.roomName);
  const creepRole = creep.memory.role;

  _.each(overseer.tasker.unassignedCreeps, (creepName) => {
    const creep = Game.creeps[creepName];
    DTCreeps.evaluate(creep);
  });
}

module.exports = ProcessTaskers;
