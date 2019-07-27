'use strict';

const DecisionCase = require('decisionCase');

// checks
const once = (c) => {return true};
const isEmpty = (c) => {return c.carry.energy == 0};
const isWithinDistanceToTarget = (c, range) => {
  const task = overseer.tasker.getTask(c);
  return c.pos.getRangeTo(task.target) <= range
};
const isCloseEnoughToUpgrade = (c) => {return isWithinDistanceToTarget(c, 3)};
const isCloseEnoughToWithdraw = (c) => {return isWithinDistanceToTarget(c, 1)};

//targetting
const assignTargetUpgrade = function(c) {
  let task = overseer.tasker.getTask(c);
  task.assignTarget(c.room.controller);
  overseer.tasker.setTask(task);
};
const assignTargetWithdrawEnergy = function(c) {
  let task = overseer.tasker.getTask(c);
  task.assignTarget(c.findStorage());
  overseer.tasker.setTask(task);
};

// Actions
const actionUpgrade = function(c) {
  let task = overseer.tasker.getTask(c);
  task.assignUpgrade(
    task.target,
    isEmpty,
  );
  overseer.tasker.setTask(task);
};

const actionWithdrawEnergy = function(c) {
  let task = overseer.tasker.getTask(c);
  task.assignWithdaw(
    task.target,
    once,
    RESOURCE_ENERGY,
    c.carryCapacity,
  );
  overseer.tasker.setTask(task);
};

const actionMoveToGetEnergy = function(c) {
  let task = overseer.tasker.getTask(c);
  task.assignMoveTo(
    task.target,
    isCloseEnoughToWithdraw,
    {
      visualizePathStyle: {
        stroke: '#ffffff'
      },
    },
  );
  overseer.tasker.setTask(task);
};

const actionMoveToUpgrade = function(c) {
  let task = overseer.tasker.getTask(c);
  task.assignMoveTo(
    task.target,
    isCloseEnoughToUpgrade,
    {
      visualizePathStyle: {
        stroke: '#ffffff'
      },
    },
  );
  overseer.tasker.setTask(task);
};

// decisionTree
const DTUpgraderEmpty = new DecisionCase(
  true,
  Array(
    new DecisionCase(isCloseEnoughToWithdraw, actionWithdrawEnergy),
    new DecisionCase(true, actionMoveToGetEnergy),
  ),
  assignTargetWithdrawEnergy
);
const DTUpgraderNotEmpty = new DecisionCase(
  true,
  Array(
    new DecisionCase(isCloseEnoughToUpgrade, actionUpgrade),
    new DecisionCase(true, actionMoveToUpgrade),
  ),
  assignTargetUpgrade
);
const DTUpgrader = new DecisionCase(
  true,
  Array(
    new DecisionCase(isEmpty, DTUpgraderEmpty),
    new DecisionCase(true, DTUpgraderNotEmpty),
  )
);

module.exports = DTUpgrader;
