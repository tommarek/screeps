'use strict';

const DecisionCase = require('decisionCase');
const DTIdler = require('decisionTree.creeps.idler');
const Task = require('overseer.task');

const utils = require('utils')

// checks
const once = function(c) {
  return true
};
const isEmpty = function(c) {
  return c.carry.energy == 0
};
const isWithinDistanceToTarget = function(c, range) {
  const targetId = overseer.tasker.getCreepTarget(c.name);
  if (!targetId) return false;
  return c.pos.getRangeTo(utils.stringToObject(targetId)) <= range
};
const isCloseEnoughToTransfer = function(c) {
  return isWithinDistanceToTarget(c, 1)
};
const isCloseEnoughToWithdraw = function(c) {
  return isWithinDistanceToTarget(c, 1)
};

//targetting
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

const shouldTransfer = function(c) {
  if (isEmpty(c)) return false;
  const target = c.findTransferTarget();
  if (target) {
    overseer.tasker.setCreepTarget(c.name, target.id);
    return true;
  }
  return false;
};


// Actions
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
    RESOURCE_ENERGY,
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
