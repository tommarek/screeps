'use strict';

const Task = require('overseer.task');

const Tasker = function(o) {
  this.unassignedCreeps = new Set([]);
  this.assignedTasks = {};

  this.memory = {};
  this.logger = o.getLogger('tasker');
}

Tasker.prototype.getCreepNamesAssigned = function() {
  return _.keys(_.pick(this.assignedTasks, (value, key) => {
    return value;
  })) || [];
}

Tasker.prototype.getCreepNamesUnassigned = function() {
  return [...this.unassignedCreeps];
}

Tasker.prototype.getTask = function(creep) {
  if (creep.name in this.assignedTasks && this.assignedTasks[creep.name]) {
    return this.assignedTasks[creep.name];
  }
  return new Task(creep);
}

Tasker.prototype.setTask = function(task) {
  const creepName = task.creep.name;
  this.unassignedCreeps.delete(creepName);
  this.assignedTasks[creepName] = task;
}

Tasker.prototype.setTempTarget = function(target) {
  this.memory.target = target;
}
Tasker.prototype.getTempTarget = function() {
  return this.memory.target;
}

Tasker.prototype.moveCreepToUnassigned = function(creepName) {
  overseer.tasker.unassignedCreeps.add(creepName);
  overseer.tasker.assignedTasks[creepName] = undefined;
}

Tasker.prototype.getMissingCreeps = function() {
  _.each(Game.creeps, (creep, creepName) => {
    if (creepName in this.assignedTasks && this.assignedTasks[creepName] !== undefined) {
      // this.logger.debug('creep ' + creepName + ' is in assignedTasks');
    } else if (this.unassignedCreeps.has(creepName)) {
      // this.logger.debug('creep ' + creepName + ' is in unassignedTasks');
    } else {
      this.logger.info('creep ' + creepName + 'not managed adding it to unassignedCreeps');
      this.unassignedCreeps.add(creepName);
    }
  });
}

Tasker.prototype.clearCreep = function(creepName) {
  this.unassignedCreeps.delete(creepName);
  this.assignedTasks[creepName] = undefined;
}

module.exports = Tasker;
