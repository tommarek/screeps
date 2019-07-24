'use strict';

const Task = require('task');

const Tasker = function() {
  this.unassignedCreeps = new Set([]);
  this.assignedTasks = {};

  this.memory = {};
}

Tasker.prototype.getTask(creep) {
  const creepName = creep.creepName;
  if (creepName in this.assignedTasks) {
    return this.assignedTasks[creepName];
  } else if (this.unassignedCreeps.has(creepName)) {
    return new Task(creep);
  } else {
    this.logger.error('Tasker asked for taskro unknown creep: ' + creepName + )
  }
}

Tasker.prototype.setTask(task) {
  const creepName = task.creep.creepName;
  // if task is already set for the creep - update it
  if (creepName in this.assignedTasks && this.assignedTasks[creepName]) {
    logger.debug('Updated an old task with a new one; creepName: ' + task.creep.creepName);
    _.each(task, (value, key) => {
      if (value && key !== 'task') this.assignedTasks[creepName][key] = value;
    });
  } else {
    logger.debug('Createad a new task; creepName: ' + task.creep.creepName);
    this.unassignedCreeps.delete(creepName);
    this.assignedTasks[creepName] = task;
  }
}

Tasker.prototype.moveCreepToUnassigned = function(creepName) {
  overseer.tasker.unassignedCreeps.add(creepName);
  overseer.tasker.assignedTasks[creepName] = undefined;
}

tasker.prototype.
