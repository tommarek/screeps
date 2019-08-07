'use strict';

const DecisionCase = require('decisionCase');
const utils = require('utils');

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
const isWithinDistanceToTarget = (c, range) => {
  const task = overseer.tasker.getTask(c);
  return c.pos.getRangeTo(task.target) <= range
};
const isCloseEnoughToWithdraw = (c) => {
  return isWithinDistanceToTarget(c, 1)
};
const isCloseEnoughToTransfer = (c) => {
  return isWithinDistanceToTarget(c, 1)
};
const isOnTargetLocation = (c) => {
  return isWithinDistanceToTarget(c, 0)
}

//targetting
const assignTargetWithdraw = function(c) {
  let task = overseer.tasker.getTask(c);
  const target = overseer.miner.getDumpTruckTarget(c.name);
  task.assignTarget(target.container);
  overseer.tasker.setTask(task);
};

const assignTargetTransfer = function(c) {
  let task = overseer.tasker.getTask(c);
  const target = overseer.miner.getDumpTruckTarget(c.name);
  task.assignTarget(c.room.storage);
  overseer.tasker.setTask(task);
};

// Actions
const actionWithdraw = function(c) {
  let task = overseer.tasker.getTask(c);
  task.assignWithdraw(
    task.target,
    isFull,
    RESOURCE_ENERGY
  );
  overseer.tasker.setTask(task);
};

const actionTransfer = function(c) {
  let task = overseer.tasker.getTask(c);
  task.assignTransfer(
    task.target,
    once,
    RESOURCE_ENERGY
  );
  overseer.tasker.setTask(task);
};

const actionMoveToWithdraw = function(c) {
  let task = overseer.tasker.getTask(c);
  task.assignMoveTo(
    task.target,
    isCloseEnoughToWithdraw, {
      visualizePathStyle: {
        stroke: '#ffffff'
      },
    }
  );
  overseer.tasker.setTask(task);
};

const actionMoveToTransfer = function(c) {
  let task = overseer.tasker.getTask(c);
  task.assignMoveTo(
    task.target,
    isCloseEnoughToTransfer, {
      visualizePathStyle: {
        stroke: '#ffffff'
      },
    }
  );
  overseer.tasker.setTask(task);
};

// decisionTree
const DTDumpTruckEmpty = new DecisionCase(
  true,
  Array(
    new DecisionCase(isCloseEnoughToWithdraw, actionWithdraw),
    new DecisionCase(true, actionMoveToWithdraw),
  ),
  assignTargetWithdraw
);
const DTDumpTruckNotEmpty = new DecisionCase(
  true,
  Array(
    new DecisionCase(isCloseEnoughToTransfer, actionTransfer),
    new DecisionCase(true, actionMoveToTransfer),
  ),
  assignTargetTransfer
);
const DTDumpTruck = new DecisionCase(
  true,
  Array(
    new DecisionCase(isEmpty, DTDumpTruckEmpty),
    new DecisionCase(true, DTDumpTruckNotEmpty),
  ),
);

module.exports = DTDumpTruck;
