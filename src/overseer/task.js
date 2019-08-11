'use strict';

const utils = require('utils')

const Task = function(creep, taskEndCondition = undefined) {
  this.creepName = creep.name;
  this.subtasks = [];
}

Task.prototype.execute = function() {
  if (!this.creepName in Game.creeps || !this.subtasks) return undefined;
  const creep = Game.creeps[this.creepName];

  const ret = {};
  _.each(this.subtasks, (subtask) => {
    if (subtask.target) {
      //overseer.tasker.logger.debug(this.creepName + ': executing ' + JSON.stringify(subtask));
      const lastReturn = this[subtask.task](creep, subtask);
      if (lastReturn != OK) ret[subtask.task] = lastReturn;
    }
  });
  if (Object.keys(ret).length === 0) return OK;
  return ret;
}

Task.prototype.isUnusable = function() {
  return !this.creepName in Game.creeps || this.subtasks.length === 0
}

Task.prototype.taskEnded = function() {
  if (!this.creepName in Game.creeps) return true;
  const creep = Game.creeps[this.creepName];
  const ret = this.subtasks.some((task) => {
    return task.taskEndCondition(creep)
  });
  return ret;
};

Task.prototype.build = function(creep, task) {
  return creep.build(
    utils.stringToObject(task.target)
  );
}
Task.prototype.assignBuild = function(target, taskEndCondition) {
  this.subtasks.push({
    task: 'build',
    target: target,
    taskEndCondition: taskEndCondition
  });
};

Task.prototype.drop = function(creep, task) {
  return creep.drop(
    task.resourceType,
    task.amount
  );
}
Task.prototype.assignDrop = function(resourceType, taskEndCondition, amount = undefined) {
  this.subtasks.push({
    task: 'drop',
    resourceType: resourceType,
    amount: amount,
    taskEndCondition: taskEndCondition
  });
};

Task.prototype.harvest = function(creep, task) {
  return creep.harvest(
    utils.stringToObject(task.target)
  );
}
Task.prototype.assignHarvest = function(target, taskEndCondition) {
  this.subtasks.push({
    task: 'harvest',
    target: target,
    taskEndCondition: taskEndCondition
  });
};

Task.prototype.moveTo = function(creep, task) {
  return creep.moveTo(
    utils.stringToObject(task.target),
    task.taskOptions
  );
};
Task.prototype.assignMoveTo = function(target, taskEndCondition, taskOptions = undefined) {
  this.subtasks.push({
    task: 'moveTo',
    target: target,
    taskEndCondition: taskEndCondition,
    taskOptions: taskOptions
  });
};

Task.prototype.pickup = function(creep, task) {
  return creep.pickup(
    utils.stringToObject(task.target),
  );
};
Task.prototype.assignPickup = function(target, taskEndCondition) {
  this.subtasks.push({
    task: 'pickup',
    target: target,
    taskEndCondition: taskEndCondition
  });
};

Task.prototype.repair = function(creep, task) {
  return creep.repair(
    utils.stringToObject(task.target),
  );
};
Task.prototype.assignRepair = function(target, taskEndCondition) {
  this.subtasks.push({
    task: 'repair',
    target: target,
    taskEndCondition: taskEndCondition
  });
};

Task.prototype.transfer = function(creep, task) {
  return creep.transfer(
    utils.stringToObject(task.target),
    task.resourceType,
    task.amount
  );
};
Task.prototype.assignTransfer = function(target, taskEndCondition, resourceType, amount = undefined) {
  this.subtasks.push({
    task: 'transfer',
    target: target,
    taskEndCondition: taskEndCondition,
    resourceType: resourceType,
    amount: amount
  });
};

Task.prototype.upgrade = function(creep, task) {
  return creep.upgradeController(
    utils.stringToObject(task.target)
  );
};
Task.prototype.assignUpgrade = function(target, taskEndCondition) {
  this.subtasks.push({
    task: 'upgrade',
    target: target,
    taskEndCondition: taskEndCondition
  });
};

Task.prototype.withdraw = function(creep, task) {
  return creep.withdraw(
    utils.stringToObject(task.target),
    task.resourceType,
    task.amount
  );
};
Task.prototype.assignWithdraw = function(target, taskEndCondition, resourceType, amount = undefined) {
  this.subtasks.push({
    task: 'withdraw',
    target: target,
    taskEndCondition: taskEndCondition,
    resourceType: resourceType,
    amount: amount,
  });
};


module.exports = Task;
