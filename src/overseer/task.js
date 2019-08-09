'use strict';

const Task = function(creep, taskEndCondition = undefined) {
  this.creep = creep;
  this.subtasks = [];
}

Task.prototype.execute = function() {
  this.refreshCreep();
  if (!this.subtasks || this.creep === undefined) return undefined
  const ret = {};
  _.each(this.subtasks, (subtask) => {
    if (subtask.target) {
      const lastReturn = this[subtask.task](subtask);
      if (lastReturn != OK) ret[subtask.task] = lastReturn;
    }
  });
  if (Object.keys(ret).length === 0) return OK;
  return ret;
}

Task.prototype.isUnusable = function() {
  return !this.creep || this.subtasks.length === 0
}

Task.prototype.taskEnded = function() {
  this.refreshCreep();
  if (this.creep === undefined) return true;
  const ret = this.subtasks.some((task) => {return task.taskEndCondition(this.creep)});
  return ret;
};

Task.prototype.refreshCreep = function(creep) {
  try {
    this.creep = Game.getObjectById(this.creep.id);
  } catch (e) {
    this.creep = undefined;
  }
}

Task.prototype.build = function(task) {
  return this.creep.build(task.target)
}
Task.prototype.assignBuild = function(target, taskEndCondition) {
  this.subtasks.push({
    task: 'build',
    target: target,
    taskEndCondition: taskEndCondition,
  });
};

Task.prototype.harvest = function(task) {
  return this.creep.harvest(task.target)
}
Task.prototype.assignHarvest = function(target, taskEndCondition) {
  this.subtasks.push({
    task: 'harvest',
    target: target,
    taskEndCondition: taskEndCondition,
  });
};

Task.prototype.moveTo = function(task) {
  return this.creep.moveTo(task.target, task.taskOptions);
};
Task.prototype.assignMoveTo = function(target, taskEndCondition, taskOptions=undefined) {
  this.subtasks.push({
    task: 'moveTo',
    target: target,
    taskEndCondition: taskEndCondition,
    taskOptions: taskOptions,
  });
};

Task.prototype.pickup = function(task) {
  return this.creep.pickup(task.target)
};
Task.prototype.assignPickup = function(target, taskEndCondition) {
  this.subtasks.push({
    task: 'pickup',
    target: target,
    taskEndCondition: taskEndCondition,
  });
};

Task.prototype.repair = function(task) {
  return this.creep.repair(task.target)
};
Task.prototype.assignRepair = function(target, taskEndCondition) {
  this.subtasks.push({
    task: 'repair',
    target: target,
    taskEndCondition: taskEndCondition,
  });
};

Task.prototype.transfer = function(task) {
  return this.creep.transfer(task.target, task.resourceType, task.amount)
};
Task.prototype.assignTransfer = function(target, taskEndCondition, resourceType, amount = undefined) {
  this.subtasks.push({
    task: 'transfer',
    target: target,
    taskEndCondition: taskEndCondition,
    resourceType: resourceType,
    amount: amount,
  });
};

Task.prototype.upgrade = function(task) {
  return this.creep.upgradeController(task.target)
};
Task.prototype.assignUpgrade = function(target, taskEndCondition) {
  this.subtasks.push({
    task: 'upgrade',
    target: target,
    taskEndCondition: taskEndCondition,
  });
};

Task.prototype.withdraw = function(task) {
  return this.creep.withdraw(task.target, task.resourceType, task.amount)
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
