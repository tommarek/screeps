'use strict';

const DecisionCase = require('decisionCase');
const Task = require('overseer.task');

const utils = require('utils')

// checks
const once = (c) => {
  return true
};
const isEmpty = (c) => {;
  return c.carry.energy == 0;
};
const isWithinDistanceToTarget = function(c, range) {
  const targetId = overseer.tasker.getCreepTarget(c.name);
  if (!targetId) return false;
  return c.pos.getRangeTo(utils.stringToObject(targetId)) <= range
};
const isCloseEnoughToUpgrade = function(c) {
  return isWithinDistanceToTarget(c, 3)
};
const isCloseEnoughToWithdraw = function(c) {
  return isWithinDistanceToTarget(c, 1)
};

//targetting
const shouldUpgrade = function(c) {
  if (isEmpty(c)) return false;
  overseer.tasker.setCreepTarget(c.name, c.room.controller.id);
  return true;
};
const shouldWithdraw = function(c) {
  if (!isEmpty(c)) return false;

  const target = c.pos.findClosestByRange(FIND_STRUCTURES, {
    filter: (s) => s.structureType == STRUCTURE_CONTAINER || s.structureType == STRUCTURE_STORAGE && s.store[RESOURCE_ENERGY] > 0
  });
  if (target) {
    overseer.tasker.setCreepTarget(c.name, target.id);
    return true;
  }
  return false;
};

// Actions
const actionUpgrade = function(c) {
  let task = new Task(c);
  task.assignUpgrade(
    overseer.tasker.getCreepTarget(c.name),
    isEmpty,
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

const actionMoveToUpgrade = function(c) {
  let task = new Task(c);
  task.assignMoveTo(
    overseer.tasker.getCreepTarget(c.name),
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
