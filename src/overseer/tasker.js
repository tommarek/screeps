'use strict';

const Task = require('overseer.task');

const Tasker = function(o) {
  this.unassignedCreeps = new Set([]);
  this.assignedTasks = {};

  this.targets = {};
  this.otherTasks = {};
  this.logger = o.getLogger('tasker');
};

Tasker.prototype.initTick = function() {
  this.targets = {};
  this.otherTasks = {};
}

Tasker.prototype.getOtherTasksInRoom = function(roomName) {
  const roomAnalysis = overseer.getRoomAnalysis(roomName);
}

Tasker.prototype.generateOtherTasks = function() {
  _.each(Game.rooms, (roomName) => {
    this.otherTasks[roomName] = this.getOtherTasksInRoom(roomName);
  });
}

Tasker.prototype.getCreepNamesAssigned = function() {
  return _.keys(_.pick(this.assignedTasks, (value, key) => {
    return value;
  })) || [];
};

Tasker.prototype.getCreepNamesUnassigned = function() {
  return [...this.unassignedCreeps];
};

Tasker.prototype.getTask = function(creep) {
  if (creep.name in this.assignedTasks && this.assignedTasks[creep.name]) {
    return this.assignedTasks[creep.name];
  }
  return new Task(creep);
};

Tasker.prototype.setTask = function(task) {
  this.unassignedCreeps.delete(task.creepName);
  this.assignedTasks[task.creepName] = task;
};

Tasker.prototype.setCreepTarget = function(creepName, target) {
  overseer.tasker.targets[creepName] = target;
};

Tasker.prototype.getCreepTarget = function(creepName) {
  return overseer.tasker.targets[creepName];
};

Tasker.prototype.moveCreepToUnassigned = function(creepName) {
  overseer.tasker.unassignedCreeps.add(creepName);
  overseer.tasker.assignedTasks[creepName] = undefined;
};

Tasker.prototype.getMissingCreeps = function() {
  _.each(Game.creeps, (creep, creepName) => {
    if (creepName in this.assignedTasks && this.assignedTasks[creepName] !== undefined) {
      // this.logger.debug('creep ' + creepName + ' is in assignedTasks');
    } else if (this.unassignedCreeps.has(creepName)) {
      // this.logger.debug('creep ' + creepName + ' is in unassignedTasks');
    } else {
      //this.logger.info('creep ' + creepName + 'not managed adding it to unassignedCreeps');
      this.unassignedCreeps.add(creepName);
    }
  });
};

Tasker.prototype.clearCreep = function(creepName) {
  this.unassignedCreeps.delete(creepName);
  this.assignedTasks[creepName] = undefined;
};

module.exports = Tasker;
