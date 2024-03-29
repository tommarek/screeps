'use strict';

const DecisionCase = require('decisionCase');
const Task = require('overseer.task');

const utils = require('utils')

// checks
const once = (c) => {
  return true
};
const isEmpty = (c) => {
  return c.carry.energy == 0
};
const isFull = (c) => {
  return _.sum(c.carry) == c.carryCapacity
};
const isWithinDistanceToTarget = function(c, range) {
  const targetId = overseer.tasker.getCreepTarget(c.name);
  if (!targetId) return false;
  return c.pos.getRangeTo(utils.stringToObject(targetId)) <= range
};
const isCloseEnoughToHarvest = (c) => {
  isWithinDistanceToTarget(c, 1)
};
const isCloseEnoughToTransfer = (c) => {
  isWithinDistanceToTarget(c, 1)
};

//targetting
const assignTargetTransfer = function(c) {
  let task = new Task(c);
  task.target = c.findStorage();
  overseer.tasker.setTask(task);
};
const assignTargetHarvest = function(c) {
  let task = new Task(c);
  task.target = c.findSource();
  overseer.tasker.setTask(task);
};

// Actions
const actionTransfer = function(c) {
  let task = new Task(c);
  task.assignTransfer(
    target = task.target,
    taskEndCondition = once,
  );
  overseer.tasker.setTask(task);
};

const actionHarvestEnergy = function(c) {
  let task = new Task(c);
  task.assignHarvest(
    target = task.target,
    taskEndCondition = isFull,
  );
  overseer.tasker.setTask(task);
};

const actionMoveToSource = function(c) {
  let task = new Task(c);
  task.assignMoveTo(
    target = task.target,
    taskEndCondition = isCloseEnoughToWithdraw,
    taskOptions = {
      visualizePathStyle: {
        stroke: '#ffffff'
      },
    }
  );
  overseer.tasker.setTask(task);
};

const actionMoveToTransfer = function(c) {
  let task = new Task(c);
  task.assignMoveTo(
    target = task.target,
    taskEndCondition = isCloseEnoughToBuild,
    taskOptions = {
      visualizePathStyle: {
        stroke: '#ffffff'
      },
    }
  );
  overseer.tasker.setTask(task);
};

// decisionTree
const DTHarvesterEmpty = new DecisionCase(
  true,
  Array(
    new DecisionCase(isCloseEnoughToHarvest, actionHarvestEnergy),
    new DecisionCase(true, actionMoveToSource),
  ),
  assignTargetHarvest
);
const DTHarvesterNotEmpty = new DecisionCase(
  true,
  Array(
    new DecisionCase(isCloseEnoughToTransfer, actionTransfer),
    new DecisionCase(true, actionMoveToTransfer),
  ),
  assignTargetTransfer
);
const DTHarvester = new DecisionCase(
  true,
  Array(
    new DecisionCase(isEmpty, DTHarvesterEmpty),
    new DecisionCase(true, DTHarvesterNotEmpty),
  )
);

module.exports = DTHarvester;
