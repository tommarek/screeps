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
  this.logger.debug('unassigned creeps :' + JSON.stringify(overseer.tasker.getCreepNamesUnassigned()));
  if (assigned.length == 0) return;
  _.each(overseer.tasker.assignedTasks, (task, creepName) => {
    if (task == undefined) {
      overseer.tasker.moveCreepToUnassigned(creepName);
    } else {
      const ret = task.execute();
      console.log(task.creep.name + ': executed task ' + task.subtasks[0].task + '; got return: ' + JSON.stringify(ret));
      if (ret != OK) {
        overseer.tasker.moveCreepToUnassigned(creepName);
      }
    }
  });
}

ProcessTasker.prototype.assignNewTasks = function() {
  // remove invalid or finished tasks so they can be reassigned
  _.each(overseer.tasker.assignedTasks, (task, creepName) => {
    if (task == undefined || task.taskEnded()){
      console.log('moving to unassigned creep: ' + creepName + 'task = ' + task);
      overseer.tasker.moveCreepToUnassigned(creepName);
    }
  });
  // assign tasks
  const unassigned = overseer.tasker.getCreepNamesUnassigned();
  if (unassigned.length == 0) {
    this.logger.debug('no unassigned creeps - ignoring');
    return;
  }
  _.each(unassigned, (creepName) => {
    const creep = Game.creeps[creepName];
    if (creep && !creep.spawning) {
      //this.logger.debug('assigning new task to ' + creepName + ', room: ' + creep.pos.roomName);
      DTCreeps.evaluate(creep);
    }
  });
}

module.exports = ProcessTasker;
