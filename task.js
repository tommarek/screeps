'use strict';

const Task = function(object, task = undefined, taskOptions = undefined, target, taskCondition = undefined) {
  this.object = object;
  this.task = task;
  this.target = target;
  this.taskEndCondition: taskCondition;
  this.lastReturn = undefined;
}

Task.prototype.execute = function() {
  if (!this.task) return undefined;
  this.lastReturn = this. [this.task]();
  return this.lastReturn;
}

Task.prototype.taskEnded = this.taskEndCondition(c);

Task.prototype.build = () => {
  return this.object.build(this.target)
}
Task.prototype.assignBuild = function(target, taskEndCondition) {
  this.task = 'build'
  this.target = target;
  this.taskEndCondition = taskCondition;
};

Task.prototype.harvest = () => {
  return this.object.harvest(this.target)
}
Task.prototype.assignHarvest = function(target, taskEndCondition) {
  this.task = 'harvest';
  this.target = target;
  this.taskEndCondition = taskCondition;
};

Task.prototype.moveTo = () => {
  return this.object.moveTo(this.target, this.taskOptions)
};
Task.prototype.assignMoveTo = function(target, taskEndCondition, taskOptions = {}) {
  this.task = 'moveTo';
  this.target = target;
  this.taskEndCondition = taskCondition;
  this.taskOptions = taskOptions;
};

Task.prototype.repair = () => {
  return this.object.repair(this.target)
};
Task.prototype.assignRepair = function(target, taskEndCondition) {
  this.task = 'repair';
  this.target = target;
  this.taskEndCondition = taskCondition;
};

Task.prototype.transfer = () => {
  return this.object.transfer(this.target, this.resourceType, this.amount)
};
Task.prototype.assignTransfer = function(target, taskEndCondition, resourceType, amount) {
  this.task = 'transfer';
  this.target = target;
  this.taskEndCondition = taskCondition;
  this.resourceType = resourceType;
  this.amount = amount;
};

Task.prototype.withdraw = () => {
  return this.object.withdraw(this.target, this.resourceType, this.amount)
};
Task.prototype.assignWithdaw = function(target, taskEndCondition, resourceType, amount) {
  this.task = 'withdraw';
  this.target = target;
  this.taskEndCondition = taskCondition;
  this.resourceType = resourceType;
  this.amount = amount;
};



module.exports = Task;
