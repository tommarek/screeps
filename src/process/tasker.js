'use strict';

const Process = require('./process.process');
const DTCreeps = require('decisionTree.creeps.creeps')

const ProcessTasker = function(params) {
  Process.call(params);

  this.logger = overseer.getLogger('tasker');
}

ProcessTasker.prototype = Object.create(Process.prototype);


ProcessTasker.prototype.run = function() {
  overseer.tasker.getMissingCreeps();
  overseer.runSubprocess('assign-creeps', this.assignNewTasks);
  overseer.runSubprocess('run-creeps', this.executeAssignedTasks);
}

ProcessTasker.prototype.executeAssignedTasks = function() {
  const assigned = overseer.tasker.getCreepNamesAssigned();
  this.logger.debug('executing existing tasks, need to run ' + assigned.length + ' tasks.');
  if (assigned.length == 0) return;
  _.each(overseer.tasker.assignedTasks, (task, creepName) => {
    if (task == undefined) {
      overseer.tasker.deleteTask(creepName);
    } else {
      const ret = task.execute();
      if (ret != OK) {
        overseer.tasker.deleteTask(creepName);
      } else {
        //this.logger.debug(task.creep.name + ': executed task ' + task.subtasks[0].task + '; got return: ' + JSON.stringify(ret));
      }
    }
  });
}

ProcessTasker.prototype.assignNewTasks = function() {
  // remove invalid or finished tasks so they can be reassigned
  _.each(overseer.tasker.assignedTasks, (task, creepName) => {
    if (task == undefined || task.isUnusable() ||task.taskEnded()) overseer.tasker.deleteTask(creepName);
  });
  // assign tasks
  _.each(Game.creeps, (creepName) => {
    if (!creepName in overseer.tasker.assignedTasks) {
      const creep = Game.creeps[creepName];
      if (creep && !creep.spawning) {
        this.logger.debug('assigning new task to ' + creepName + ', room: ' + creep.pos.roomName);
        DTCreeps.evaluate(creep);
      }
    }
  });
}

module.exports = ProcessTasker;
