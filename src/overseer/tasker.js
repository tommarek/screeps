'use strict';

const Task = require('overseer.task');

const Tasker = function(o) {
  this.idlers = new Set([]);
  this.assignedTasks = {};
  this.otherTasks = {};

  this.targets = {};
  this.logger = o.getLogger('tasker');
};

Tasker.prototype.initTick = function() {
  this.idlers = new Set([]);
  this.otherTasks = {};
  this.targets = {};
};

Tasker.prototype.getOtherTasksInRoom = function(roomName) {
  const roomAnalysis = overseer.getRoomAnalysis(roomName);
};

Tasker.prototype.generateOtherTasks = function() {
  _.each(Game.rooms, (roomName) => {
    this.otherTasks[roomName] = this.getOtherTasksInRoom(roomName);
  });
};

Tasker.prototype.addIdler = function(creep) {
  var creepName;
  if (creep instanceof String) {
    creepName = creep;
  } else {
    creepName = creep.name;
  };
  this.idlers.add(creepName);
};

Tasker.prototype.getCreepNamesAssigned = function() {
  return _.keys(_.pick(this.assignedTasks, (value, key) => {
    return value;
  })) || [];
};

Tasker.prototype.getTask = function(creep) {
  if (creep.name in this.assignedTasks && this.assignedTasks[creep.name]) {
    return this.assignedTasks[creep.name];
  };
  return new Task(creep);
};

Tasker.prototype.setTask = function(task) {
  this.assignedTasks[task.creepName] = task;
};

Tasker.prototype.deleteTask = function(creepName) {
  overseer.tasker.assignedTasks[creepName] = undefined;
};

Tasker.prototype.setCreepTarget = function(creepName, target) {
  overseer.tasker.targets[creepName] = target;
};

Tasker.prototype.getCreepTarget = function(creepName) {
  return overseer.tasker.targets[creepName];
};

module.exports = Tasker;
