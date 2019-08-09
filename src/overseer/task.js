'use strict';

const Task = function(object, task = undefined, taskOptions = undefined, target, taskCondition = undefined) {
  this.object = object;
  this.task = task;
  this.target = target;
  this.taskEndCondition = taskCondition;
  this.lastReturn = undefined;
}

Task.prototype.execute = function() {
  if (!this.task || !this.object) return null;
  this.refreshObject();
  this.lastReturn = this[this.task]();
  return this.lastReturn;
}

Task.prototype.taskEnded = function() {
  this.refreshObject();
  if (this.taskEndCondition === undefined) return true;
  return this.taskEndCondition(this.object)
};

Task.prototype.refreshObject = function() {
  this.object = Game.getObjectById(this.object.id);
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

Task.prototype.pickup = function() {
  return this.object.pickup(this.target)
};
Task.prototype.assignPickup = function(target, taskEndCondition) {
  this.task = 'pickup';
  this.target = target;
  this.taskEndCondition = taskEndCondition;
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
Task.prototype.assignTransfer = function(target, taskEndCondition, resourceType, amount = undefined) {
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
Task.prototype.assignWithdraw = function(target, taskEndCondition, resourceType, amount = undefined) {
  this.task = 'withdraw';
  this.target = target;
  this.taskEndCondition = taskEndCondition;
  this.resourceType = resourceType;
  this.amount = amount;
};


module.exports = Task;
