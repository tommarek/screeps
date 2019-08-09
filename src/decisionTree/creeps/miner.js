'use strict';

const DecisionCase = require('decisionCase');
const utils = require('utils');

// checks
const once = (c) => {
  return true
};
const forever = (c) => {
  return false
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
const isCloseEnoughToHarvest = (c) => {
  return isWithinDistanceToTarget(c, 1)
};
const isCloseEnoughToTransfer = (c) => {
  return isWithinDistanceToTarget(c, 1)
};
const isOnTargetLocation = (c) => {
  return isWithinDistanceToTarget(c, 0)
};
const isOnMiningLocation = (c) => {
  const target = overseer.miner.getMinerTarget(c.name);
  return c.pos.getRangeTo(target.miningPos) == 0;
};

//targetting
const assignTargetHarvest = function(c) {
  let task = overseer.tasker.getTask(c);
  const target = overseer.miner.getMinerTarget(c.name);
  task.assignTarget(target.source);
  overseer.tasker.setTask(task);
};

const assignTargetTransfer = function(c) {
  let task = overseer.tasker.getTask(c);
  const target = overseer.miner.getMinerTarget(c.name);
  task.assignTarget(target.container);
  overseer.tasker.setTask(task);
};

// Actions
const actionTransfer = function(c) {
  let task = overseer.tasker.getTask(c);
  const target = overseer.miner.getMinerTarget(c.name);
  task.assignTransfer(
    target.container,
    once,
    RESOURCE_ENERGY
  );
  overseer.tasker.setTask(task);
};

const actionHarvestEnergy = function(c) {
  let task = overseer.tasker.getTask(c);
  const target = overseer.miner.getMinerTarget(c.name);
  task.assignHarvest(
    target.source,
    forever,
  );
  overseer.tasker.setTask(task);
};

const actionMoveToSource = function(c) {
  let task = overseer.tasker.getTask(c);
  const target = overseer.miner.getMinerTarget(c.name);
  task.assignMoveTo(
    target.miningPos,
    isOnTargetLocation, {
      visualizePathStyle: {
        stroke: '#ffffff'
      },
    }
  );
  overseer.tasker.setTask(task);
};

const actionMoveToTransfer = function(c) {
  let task = overseer.tasker.getTask(c);
  const target = overseer.miner.getMinerTarget(c.name);
  task.assignMoveTo(
    target.miningPos,
    isOnTargetLocation, {
      visualizePathStyle: {
        stroke: '#ffffff'
      },
    }
  );
  overseer.tasker.setTask(task);
};

// decisionTree
const DTMinerEmpty = new DecisionCase(
  true,
  Array(
    new DecisionCase(isOnMiningLocation, actionHarvestEnergy),
    new DecisionCase(true, actionMoveToSource),
  ),
  assignTargetHarvest
);
const DTMinerNotEmpty = new DecisionCase(
  true,
  Array(
    new DecisionCase(isOnMiningLocation, actionTransfer),
    new DecisionCase(true, actionMoveToTransfer),
  ),
  assignTargetTransfer
);
const DTMiner = new DecisionCase(
  true,
  Array(
    new DecisionCase(isEmpty, DTMinerEmpty),
    new DecisionCase(true, DTMinerNotEmpty),
  ),
);

module.exports = DTMiner;
