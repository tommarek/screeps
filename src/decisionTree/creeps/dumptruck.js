'use strict';

const DecisionCase = require('decisionCase');
const DTIdler = require('decisionTree.creeps.idler');
const Task = require('overseer.task');

const utils = require('utils');

// checks
const once = function(c) {
  return true
};
const isEmpty = function(c) {
  return c.carry.energy == 0
};
const isFull = function(c) {
  return _.sum(c.carry) == c.carryCapacity
};
const isWithinDistanceToTarget = function(c, range) {
  return c.pos.getRangeTo(overseer.tasker.getCreepTarget(c.name)) <= range
};
const isCloseEnoughToPickup = function(c) {
  return isWithinDistanceToTarget(c, 1)
};
const isCloseEnoughToWithdraw = function(c) {
  return isWithinDistanceToTarget(c, 1)
};
const isCloseEnoughToTransfer = function(c) {
  return isWithinDistanceToTarget(c, 1)
};

//targetting
const shouldPickup = function(c) {
  if (!isEmpty(c)) return false;
  const target = overseer.miner.getDumpTruckTarget(c.name);
  const energy = _.first(target.miningPos.lookFor(LOOK_ENERGY));
  if (energy) {
    overseer.tasker.setCreepTarget(c.name, energy);
    return true;
  }
  return false;
};

const shouldWithdraw = function(c) {
  if (isFull(c)) return false;
  const target = overseer.miner.getDumpTruckTarget(c.name);
  const container = target.container;
  if (container) {
    overseer.tasker.setCreepTarget(c.name, container);
    return true;
  }
  return false;
};

const shouldTransfer = function(c) {
  if (isEmpty(c)) return false;
  const storage = c.room.storage;
  if (storage) {
    overseer.tasker.setCreepTarget(c.name, storage);
    return true;
  }
  return false;
};

// Actions
const actionPickup = function(c) {
  let task = new Task(c);
  task.assignPickup(
    overseer.tasker.getCreepTarget(c.name),
    once
  );
  overseer.tasker.setTask(task);
};

const actionWithdraw = function(c) {
  let task = new Task(c);
  task.assignWithdraw(
    overseer.tasker.getCreepTarget(c.name),
    once,
    RESOURCE_ENERGY
  );
  overseer.tasker.setTask(task);
};

const actionTransfer = function(c) {
  let task = new Task(c);
  task.assignTransfer(
    overseer.tasker.getCreepTarget(c.name),
    once,
    RESOURCE_ENERGY
  );
  overseer.tasker.setTask(task);
};

const actionMoveToPickup = function(c) {
  let task = new Task(c);
  task.assignMoveTo(
    overseer.tasker.getCreepTarget(c.name),
    isCloseEnoughToPickup, {
      visualizePathStyle: {
        stroke: '#ffffff'
      },
    }
  );
  overseer.tasker.setTask(task);
};

const actionMoveToWithdraw = function(c) {
  let task = new Task(c);
  task.assignMoveTo(
    overseer.tasker.getCreepTarget(c.name),
    isCloseEnoughToWithdraw, {
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
    overseer.tasker.getCreepTarget(c.name),
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
