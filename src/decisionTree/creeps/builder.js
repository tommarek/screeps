'use strict';

const DecisionCase = require('decisionCase');

// checks
const once = function(c) {
  return true
};
const isEmpty = function(c) {
  return c.carry.energy == 0
};
const isWithinDistanceToTarget = function(c, range) {
  const task = overseer.tasker.getTask(c);
  return c.pos.getRangeTo(task.target) <= range
};
const isCloseEnoughToBuild = function(c) {
  return isWithinDistanceToTarget(c, 3)
};
const isCloseEnoughToWithdraw = function(c) {
  return isWithinDistanceToTarget(c, 1)
};

//targetting
const assignTargetBuild = function(c) {
  let task = overseer.tasker.getTask(c);
  task.assignTarget(c.findConstruction() || c.findRepair());
  overseer.tasker.setTask(task);
};
const assignTargetWithdrawEnergy = function(c) {
  let task = overseer.tasker.getTask(c);
  task.assignTarget(c.findStorage());
  overseer.tasker.setTask(task);
};

// Actions
const actionBuild = function(c) {
  let task = overseer.tasker.getTask(c);
  task.assignBuild(
    task.target,
    (c) => {
      let task = overseer.tasker.getTask(c);
      if (task.lastReturn != OK || isEmpty(c)) {
        return true;
      }
      return false;
    }
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
    isCloseEnoughToWithdraw, {
      visualizePathStyle: {
        stroke: '#ffffff'
      },
    }
  );
  overseer.tasker.setTask(task);
};

const actionMoveToBuild = function(c) {
  let task = overseer.tasker.getTask(c);
  task.assignMoveTo(
    task.target,
    isCloseEnoughToBuild, {
      visualizePathStyle: {
        stroke: '#ffffff'
      },
    }
  );
  overseer.tasker.setTask(task);
};

// decisionTree
const DTBuilderNotEmpty = new DecisionCase(
  true,
  Array(
    new DecisionCase(isCloseEnoughToBuild, actionBuild),
    new DecisionCase(true, actionMoveToBuild),
  ),
  assignTargetBuild
);
const DTBuilderEmpty = new DecisionCase(
  true,
  Array(
    new DecisionCase(isCloseEnoughToWithdraw, actionWithdrawEnergy),
    new DecisionCase(true, actionMoveToGetEnergy),
  ),
  assignTargetWithdrawEnergy
);
const DTBuilder = new DecisionCase(
  true,
  Array(
    new DecisionCase(isEmpty, DTBuilderEmpty),
    new DecisionCase(true, DTBuilderNotEmpty),
  )
);

module.exports = DTBuilder;
