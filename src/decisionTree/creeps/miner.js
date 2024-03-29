'use strict';

const DecisionCase = require('decisionCase');
const Task = require('overseer.task');

const utils = require('utils')

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
const isWithinDistanceToTarget = function(c, range) {
  const targetId = overseer.tasker.getCreepTarget(c.name);
  if (!targetId) return false;
  return c.pos.getRangeTo(utils.stringToObject(targetId)) <= range
};
const isCloseEnoughToHarvest = function(c) {
  return isWithinDistanceToTarget(c, 1)
};
const isCloseEnoughToTransfer = function(c) {
  return isWithinDistanceToTarget(c, 1)
};
const isOnTargetLocation = function(c) {
  return isWithinDistanceToTarget(c, 0)
};
const isOnMiningLocation = function(c) {
  const targetId = overseer.miner.getMinerTarget(c.name);
  if (!targetId) return false;
  return c.pos.getRangeTo(utils.stringToObject(targetId.miningPos)) == 0;
};

//targetting
const shouldMine = function(c) {
  if (!isEmpty(c)) return false;
  const target = overseer.miner.getMinerTarget(c.name);
  if (target) {
    overseer.tasker.setCreepTarget(c.name, target.sourceId);
    return true;
  }
  return false;
}

const shouldTransfer = function(c) {
  if (c.getActiveBodyparts(CARRY) == 0 || isEmpty(c)) return false;
  const target = overseer.miner.getMinerTarget(c.name);
  if (target.container && container.storeCapacity - _.sum(container.store) < c.carry[RESOURCE_ENERGY]) {
    overseer.tasker.setCreepTarget(c.name, target.containerId);
    return true;
  }
  return false;
}

// Actions
const actionTransfer = function(c) {
  let task = new Task(c);
  task.assignTransfer(
    overseer.tasker.getCreepTarget(c.name),
    once,
    RESOURCE_ENERGY
  );
  overseer.tasker.setTask(task);
};

const actionMine = function(c) {
  let task = new Task(c);
  task.assignHarvest(
    overseer.tasker.getCreepTarget(c.name),
    forever,
  );
  if (c.getActiveBodyparts(CARRY) !== 0 && !isEmpty(c)) {
    task.assignDrop(
      RESOURCE_ENERGY,
      forever
    );
  };
  overseer.tasker.setTask(task);
};

const actionMoveToMiningLocation = function(c) {
  let task = new Task(c);
  const target = overseer.miner.getMinerTarget(c.name);
  task.assignMoveTo(
    target.miningPos,
    isOnMiningLocation, {
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
