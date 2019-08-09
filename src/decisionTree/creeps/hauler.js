'use strict';

const DecisionCase = require('decisionCase');

// checks
const once = (c) => {
  return true
};
const isEmpty = (c) => {
  return c.carry.energy == 0
};
const isWithinDistanceToTarget = (c, range) => {
  const task = overseer.tasker.getTask(c);
  return c.pos.getRangeTo(task.target) <= range
};
const isCloseEnoughToTransfer = (c) => {
  return isWithinDistanceToTarget(c, 1)
};
const isCloseEnoughToWithdraw = (c) => {
  return isWithinDistanceToTarget(c, 1)
};

//targetting
const assignTargetStore = function(c) {
  let task = overseer.tasker.getTask(c);
  task.assignTarget(c.findTransferTarget());
  overseer.tasker.setTask(task);
};
const assignTargetWithdrawEnergy = function(c) {
  let task = overseer.tasker.getTask(c);
  task.assignTarget(c.findStorage());
  overseer.tasker.setTask(task);
};

// Actions
const actionTransfer = function(c) {
  let task = overseer.tasker.getTask(c);
  task.assignTransfer(
    task.target,
    once,
    RESOURCE_ENERGY,
  );
  overseer.tasker.setTask(task);
};

const actionWithdrawEnergy = function(c) {
  let task = overseer.tasker.getTask(c);
  task.assignWithdraw(
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
    },
  );
  overseer.tasker.setTask(task);
};

const actionMoveToTransfer = function(c) {
  let task = overseer.tasker.getTask(c);
  const target = task.target;
  task.assignMoveTo(
    target,
    isCloseEnoughToTransfer, {
      visualizePathStyle: {
        stroke: '#ffffff'
      },
    },
  );
  overseer.tasker.setTask(task);
};

// decisionTree
const DTHaulerEmpty = new DecisionCase(
  true,
  Array(
    new DecisionCase(isCloseEnoughToWithdraw, actionWithdrawEnergy),
    new DecisionCase(true, actionMoveToWithdraw),
  ),
  assignTargetWithdrawEnergy
);
const DTHaulerNotEmpty = new DecisionCase(
  true,
  Array(
    new DecisionCase(isCloseEnoughToTransfer, actionTransfer),
    new DecisionCase(true, actionMoveToTransfer),
  ),
  assignTargetStore
);
const DTHauler = new DecisionCase(
  true,
  Array(
    // TODO! conver this to Should.... and add idler branch
    new DecisionCase(isEmpty, DTHaulerEmpty),
    new DecisionCase(true, DTHaulerNotEmpty),
  )
);

module.exports = DTHauler;
