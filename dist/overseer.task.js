'use strict';

const Task = function(object, task = undefined, taskOptions = undefined, target, taskCondition = undefined) {
  this.object = object;
  this.task = task;
  this.target = target;
  this.taskEndCondition = taskCondition;
  this.lastReturn = undefined;
}

Task.prototype.execute = function() {
  this.refreshObject();
  if (!this.task || !this.object) return null;
  this.lastReturn = this[this.task]();
  overseer.tasker.logger.debug('EXECUTING creep ' + this.object.name + ', task: ' + this.task + ' target: ' + this.target + ' ret: ' + this.lastReturn);
  return this.lastReturn;
}

Task.prototype.taskEnded = function() {
  this.refreshObject();
  if (this.taskEndCondition === undefined) return true;
  return this.taskEndCondition(this.object)
};

Task.prototype.refreshObject = function() {
  try {
    this.object = Game.getObjectById(this.object.id);
  } catch (error) {
    this.object = undefined;
  }
}

Task.prototype.assignTarget = function(target) {
  this.target = target
}

Task.prototype.build = function() {
  return this.object.build(this.target)
}
Task.prototype.assignBuild = function(target, taskEndCondition) {
  this.task = 'build'
  this.target = target;
  this.taskEndCondition = taskEndCondition;
};

Task.prototype.harvest = function() {
  return this.object.harvest(this.target)
}
Task.prototype.assignHarvest = function(target, taskEndCondition) {
  this.task = 'harvest';
  this.target = target;
  this.taskEndCondition = taskEndCondition;
};

Task.prototype.moveTo = function() {
  return this.object.moveTo(this.target, this.taskOptions);
};
Task.prototype.assignMoveTo = function(target, taskEndCondition, taskOptions = {}) {
  this.task = 'moveTo';
  this.target = target;
  this.taskEndCondition = taskEndCondition;
  this.taskOptions = taskOptions;
};

Task.prototype.repair = function() {
  return this.object.repair(this.target)
};
Task.prototype.assignRepair = function(target, taskEndCondition) {
  this.task = 'repair';
  this.target = target;
  this.taskEndCondition = taskEndCondition;
};

Task.prototype.transfer = function() {
  return this.object.transfer(this.target, this.resourceType, this.amount)
};
Task.prototype.assignTransfer = function(target, taskEndCondition, resourceType, amount) {
  this.task = 'transfer';
  this.target = target;
  this.taskEndCondition = taskEndCondition;
  this.resourceType = resourceType;
  this.amount = amount;
};

Task.prototype.upgrade = function() {
  return this.object.upgradeController(this.target)
};
Task.prototype.assignUpgrade = function(target, taskEndCondition) {
  this.task = 'upgrade';
  this.target = target;
  this.taskEndCondition = taskEndCondition;
};

Task.prototype.withdraw = function() {
  return this.object.withdraw(this.target, this.resourceType, this.amount)
};
Task.prototype.assignWithdaw = function(target, taskEndCondition, resourceType, amount) {
  this.task = 'withdraw';
  this.target = target;
  this.taskEndCondition = taskEndCondition;
  this.resourceType = resourceType;
  this.amount = amount;
};


module.exports = Task;
