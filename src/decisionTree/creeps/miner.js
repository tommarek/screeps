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
  return c.pos.getRangeTo(overseer.tasker.getTempTarget()) <= range
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
const shouldMine = function(c) {
  if (!isEmpty(c)) return false;
  const target = overseer.miner.getMinerTarget(c.name);
  if (target) {
    overseer.tasker.setTempTarget(target);
    return true;
  }
  return false;
}

const shouldTransfer = function(c) {
  if (c.getActiveBodyparts(CARRY) == 0 || isEmpty(c)) return false;
  const target = overseer.miner.getMinerTarget(c.name);
  if (target.container && container.storeCapacity - _.sum(container.store) < c.carry[RESOURCE_ENERGY]) {
    overseer.tasker.setTempTarget(target.container);
    return true;
  }
  return false;
}

const shouldDrop = function(c) {
  if (c.getActiveBodyparts(CARRY) == 0 || isEmpty(c)) return false;
  const target = overseer.miner.getMinerTarget(c.name);
  if (!target.container) {
    overseer.tasker.setTempTarget(undefined);
    return true;
  }
  return false;
}


// Actions
const actionTransfer = function(c) {
  let task = overseer.tasker.getTask(c);
  task.assignTransfer(
    overseer.tasker.getTempTarget(),
    once,
    RESOURCE_ENERGY
  );
  overseer.tasker.setTask(task);
};

const actionMine = function(c) {
  let task = overseer.tasker.getTask(c);
  task.assignHarvest(
    overseer.tasker.getTempTarget(),
    forever,
  );
  overseer.tasker.setTask(task);
};

const actionMoveToMiningLocation = function(c) {
  let task = overseer.tasker.getTask(c);
  task.assignMoveTo(
    overseer.tasker.getTempTarget(),
    isOnTargetLocation, {
      visualizePathStyle: {
        stroke: '#ffffff'
      },
    }
  );
  overseer.tasker.setTask(task);
};


// decisionTree
const DTMinerMine = new DecisionCase(
  true,
  Array(
    new DecisionCase(isOnMiningLocation, actionMine),
    new DecisionCase(true, actionMoveToMiningLocation),
  )
);
const DTMinerTransfer = new DecisionCase(
  true,
  Array(
    new DecisionCase(isOnMiningLocation, actionTransfer),
    new DecisionCase(true, actionMoveToMiningLocation),
  )
);
const DTMiner = new DecisionCase(
  true,
  Array(
    new DecisionCase(shouldMine, DTMinerMine),
    new DecisionCase(shouldTransfer, DTMinerTransfer),
  ),
);

module.exports = DTMiner;
