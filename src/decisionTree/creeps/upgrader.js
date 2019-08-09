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
  return c.pos.getRangeTo(overseer.tasker.getTempTarget()) <= range
};
const isCloseEnoughToUpgrade = (c) => {
  return isWithinDistanceToTarget(c, 3)
};
const isCloseEnoughToWithdraw = (c) => {
  return isWithinDistanceToTarget(c, 1)
};

//targetting
const shouldUpgrade = function(c) {
  if (isEmpty(c)) return false;
  overseer.tasker.setTempTarget(c.room.controller);
  return true;
};
const shouldWithdraw = function(c) {
  if (!isEmpty(c)) return false;

  const target = c.pos.findClosestByRange(FIND_STRUCTURES, {
    filter: (s) => s.structureType == STRUCTURE_CONTAINER || s.structureType == STRUCTURE_STORAGE && s.store[RESOURCE_ENERGY] > 0
  });
  if (target) {
    overseer.tasker.setTempTarget(target);
    return true;
  }
  return false;
};

// Actions
const actionUpgrade = function(c) {
  let task = overseer.tasker.getTask(c);
  task.assignUpgrade(
    overseer.tasker.getTempTarget(),
    isEmpty,
  );
  overseer.tasker.setTask(task);
};

const actionWithdraw = function(c) {
  let task = overseer.tasker.getTask(c);
  task.assignWithdraw(
    overseer.tasker.getTempTarget(),
    once,
    RESOURCE_ENERGY
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

const actionMoveToUpgrade = function(c) {
  let task = overseer.tasker.getTask(c);
  task.assignMoveTo(
    overseer.tasker.getTempTarget(),
    isCloseEnoughToUpgrade, {
      visualizePathStyle: {
        stroke: '#ffffff'
      },
    },
  );
  overseer.tasker.setTask(task);
};

// decisionTree
const DTUpgrade = new DecisionCase(
  true,
  Array(
  new DecisionCase(isCloseEnoughToUpgrade, actionUpgrade),
  new DecisionCase(true, actionMoveToUpgrade),
  )
);
const DTWithdraw = new DecisionCase(
  true,
  Array(
    new DecisionCase(isCloseEnoughToWithdraw, actionWithdraw),
    new DecisionCase(true, actionMoveToWithdraw),
  )
);
const DTUpgrader = new DecisionCase(
  true,
  Array(
    new DecisionCase(shouldUpgrade, DTUpgrade),
    new DecisionCase(shouldWithdraw, DTWithdraw),
  )
);

module.exports = DTUpgrader;
