'use strict';

const Process = require('./process.process');
const DTCreeps = require('decisionTree.creeps.creeps')

const ProcessTasker = function(params) {
  Process.call(params);
}

ProcessTasker.prototype = Object.create(Process.prototype);


ProcessTasker.prototype.run = function() {
  overseer.tasker.getMissingCreeps();
  overseer.runSubprocess('assign-creeps', this.assignNewTasks);
  overseer.runSubprocess('run-creeps', this.executeAssignedTasks);
}

ProcessTasker.prototype.executeAssignedTasks = function() {
  const assigned = overseer.tasker.getCreepNamesAssigned();
  overseer.tasker.logger.debug('executing existing tasks, need to run ' + assigned.length + ' tasks.');
  overseer.tasker.logger.debug('unassigned creeps :' + JSON.stringify(overseer.tasker.getCreepNamesUnassigned()));
  if (assigned.length == 0) return;
  _.each(overseer.tasker.assignedTasks, (task, creepName) => {
    if (task == undefined || !task.object) {
      overseer.tasker.moveCreepToUnassigned(creepName);
    } else {
      const ret = task.execute();
      if (ret != OK || task.taskEnded()) {
        overseer.tasker.logger.debug('FINISHED TASK - creepName ' + creepName + ' task = ' + task.task);
        overseer.tasker.moveCreepToUnassigned(creepName);
      }
    }
  });
}

ProcessTasker.prototype.assignNewTasks = function() {
  const unassigned = overseer.tasker.getCreepNamesUnassigned();
  if (unassigned.length == 0) {
    overseer.tasker.logger.debug('no unassigned creeps - ignoring');
    return;
  }
  _.each(unassigned, (creepName) => {
    const creep = Game.creeps[creepName];
    if (creep && !creep.spawning) {
      overseer.tasker.logger.debug('assigning new task to ' + creepName + ', room: ' + creep.pos.roomName);
      DTCreeps.evaluate(creep);
    }
  });
}

module.exports = ProcessTasker;
