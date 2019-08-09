'use strict';

const DecisionCase = require('decisionCase');
const DTIdler = require('decisionTree.creeps.idler');

// checks
const once = (c) => {
  return true
};
const isEmpty = (c) => {
  return c.carry.energy == 0
};
const isWithinDistanceToTarget = (c, range) => {
  return c.pos.getRangeTo(overseer.tasker.getTempTarget()) <= range
};
const isCloseEnoughToTransfer = (c) => {
  return isWithinDistanceToTarget(c, 1)
};
const isCloseEnoughToWithdraw = (c) => {
  return isWithinDistanceToTarget(c, 1)
};

//targetting
const shouldWithdraw = function(c) {
  if (!isEmpty(c)) return false;
  const target = c.pos.findClosestByRange(FIND_STRUCTURES, {
    filter: (s) => s.structureType == STRUCTURE_CONTAINER || s.structureType == STRUCTURE_STORAGE && s.store[RESOURCE_ENERGY] > 0
  });
  if (target) {
    overseer.tasker.setTempTarget(target);
    console.log('hauler: should withdraw');
    return true;
  }
  console.log('hauler: should not withdraw');
  return false;
};

const shouldTransfer = function(c) {
  if (isEmpty(c)) return false;
  const target = c.findTransferTarget();
  if (target) {
    overseer.tasker.setTempTarget(target);
    console.log('hauler: should transfer');
    return true;
  }
  console.log('hauler: should not transfer');
  return false;
};


// Actions
const actionWithdraw = function(c) {
  let task = overseer.tasker.getTask(c);
  task.assignWithdraw(
    overseer.tasker.getTempTarget(),
    once,
    RESOURCE_ENERGY
  );
  overseer.tasker.setTask(task);
};

const actionTransfer = function(c) {
  let task = overseer.tasker.getTask(c);
  task.assignTransfer(
    overseer.tasker.getTempTarget(),
    once,
    RESOURCE_ENERGY,
  );
  overseer.tasker.setTask(task);
};

const actionMoveToWithdraw = function(c) {
  let task = overseer.tasker.getTask(c);
  task.assignMoveTo(
    overseer.tasker.getTempTarget(),
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
    overseer.tasker.getTempTarget(),
    isCloseEnoughToTransfer, {
      visualizePathStyle: {
        stroke: '#ffffff'
      },
    },
  );
  overseer.tasker.setTask(task);
};

// decisionTree
const DTWithdraw = new DecisionCase(
  true,
  Array(
    new DecisionCase(isCloseEnoughToWithdraw, actionWithdraw),
    new DecisionCase(true, actionMoveToWithdraw),
  )
);
const DTTransfer = new DecisionCase(
  true,
  Array(
    new DecisionCase(isCloseEnoughToTransfer, actionTransfer),
    new DecisionCase(true, actionMoveToTransfer),
  )
);
const DTHauler = new DecisionCase(
  true,
  Array(
    new DecisionCase(shouldWithdraw, DTWithdraw),
    new DecisionCase(shouldTransfer, DTTransfer),
    new DecisionCase(true, DTIdler),
  )
);

module.exports = DTHauler;
