'use strict';

const DecisionCase = require('decisionCase');
const DTIdler = require('decisionTree.creeps.idler');

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
const isCloseEnoughToPickup = (c) => {
  return isWithinDistanceToTarget(c, 1)
};
const isCloseEnoughToWithdraw = (c) => {
  return isWithinDistanceToTarget(c, 1)
};
const isCloseEnoughToTransfer = (c) => {
  return isWithinDistanceToTarget(c, 1)
};

//targetting
const shouldPickup = function(c) {
  if (!isEmpty(c)) return false;
  const target = overseer.miner.getDumpTruckTarget(c.name);
  const energy = _.first(target.miningPos.lookFor(LOOK_ENERGY));
  if (energy) {
    let task = overseer.tasker.getTask(c);
    task.assignTarget(energy);
    overseer.tasker.setTask(task);
    return true;
  }
  return false;
};

const shouldWithdraw = function(c) {
  if (isFull(c)) return false;
  const target = overseer.miner.getDumpTruckTarget(c.name);
  const container = target.container;
  if (container) {
    let task = overseer.tasker.getTask(c);
    task.assignTarget(target.container);
    overseer.tasker.setTask(task);
    return true;
  }
  return false;
};

const shouldTransfer = function(c) {
  if (isEmpty(c)) return false;
  const storage = c.room.storage;
  if (storage) {
    let task = overseer.tasker.getTask(c);
    task.assignTarget(storage);
    overseer.tasker.setTask(task);
    return true;
  }
  return false;
};

// Actions
const actionPickup = function(c) {
  let task = overseer.tasker.getTask(c);
  task.assignPickup(
    task.target,
    once
  );
  overseer.tasker.setTask(task);
};

const actionWithdraw = function(c) {
  let task = overseer.tasker.getTask(c);
  task.assignWithdraw(
    task.target,
    once,
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

const actionMoveToPickup = function(c) {
  let task = overseer.tasker.getTask(c);
  task.assignMoveTo(
    task.target,
    isCloseEnoughToPickup, {
      visualizePathStyle: {
        stroke: '#ffffff'
      },
    }
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
const DTShouldPickup = new DecisionCase(
  true,
  Array(
    new DecisionCase(isCloseEnoughToPickup, actionPickup),
    new DecisionCase(true, actionMoveToPickup),
  )
);
const DTShouldWithdraw = new DecisionCase(
  true,
  Array(
    new DecisionCase(isCloseEnoughToWithdraw, actionWithdraw),
    new DecisionCase(true, actionMoveToWithdraw),
  )
);
const DTShouldTransfer = new DecisionCase(
  true,
  Array(
    new DecisionCase(isCloseEnoughToTransfer, actionTransfer),
    new DecisionCase(true, actionMoveToTransfer),
  )
);
const DTDumpTruck = new DecisionCase(
  true,
  Array(
    new DecisionCase(shouldPickup, DTShouldPickup),
    new DecisionCase(shouldWithdraw, DTShouldWithdraw),
    new DecisionCase(shouldTransfer, DTShouldTransfer),
    // new DecisionCase(true, DTIdler), // this should never be called for dumptruck
  ),
);

module.exports = DTDumpTruck;
