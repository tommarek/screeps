'use strict';

const DecisionCase = require('decisionCase');

// checks
const once = (c) => {return true};
const isEmpty = (c) => {return c.carry.energy == 0};
const isWithinDistanceToTarget = (c, range) => {
  const task = overseer.tasker.getTask(c);
  return c.pos.getRangeTo(task.target) <= range
};
const isCloseEnoughToRepair = (c) => {isWithinDistanceToTarget(c, 3)};
const isCloseEnoughToWithdraw = (c) => {isWithinDistanceToTarget(c, 1)};

//targetting
const assignTargetRepair = function(c) {
  let task = overseer.tasker.getTask(c);
  task.target = c.findRepair() || c.findConstruction();
  overseer.tasker.setTask(task);
};
const assignTargetWithdrawEnergy = function(c) {
  let task = overseer.tasker.getTask(c);
  task.target = c.findStorage();
  overseer.tasker.setTask(task);
};

// Actions
const actionRepair = function(c) {
  let task = overseer.tasker.getTask(c);
  task.assignRepair(
    target = task.target,
    taskEndCondition = (c) => {
      let task = overseer.tasker.getActiveTask(c);
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
    target = task.target,
    taskEndCondition = once,
    resourceType = RESOURCE_ENERGY,
    amount = c.carryCapacity,
  );
  overseer.tasker.setTask(task);
};

const actionMoveToGetEnergy = function(c) {
  let task = overseer.tasker.getTask(c);
  task.assignMoveTo(
    target = task.target,
    taskEndCondition = isCloseEnoughToWithdraw,
    taskOptions = {
      visualizePathStyle: {
        stroke: '#ffffff'
      },
    }
  );
  overseer.tasker.setTask(task);
};

const actionMoveToRepair = function(c) {
  let task = overseer.tasker.getTask(c);
  task.assignMoveTo(
    target = task.target,
    taskEndCondition = isCloseEnoughToRepair,
    taskOptions = {
      visualizePathStyle: {
        stroke: '#ffffff'
      },
    }
  );
  overseer.tasker.setTask(task);
};

// decisionTree
const DTRepairerEmpty = new DecisionCase(
  true,
  Array(
    new DecisionCase(isCloseEnoughToWithdraw, actionWithdrawEnergy),
    new DecisionCase(true, actionMoveToGetEnergy),
  ),
  assignTargetWithdrawEnergy
);
const DTRepairerNotEmpty = new DecisionCase(
  true,
  Array(
    new DecisionCase(isCloseEnoughToRepair, actionRepair),
    new DecisionCase(true, actionMoveToRepair),
  ),
  assignTargetRepair
);
const DTRepairer = new DecisionCase(
  true,
  Array(
    new DecisionCase(isEmpty, DTRepairerEmpty),
    new DecisionCase(true, DTRepairerNotEmpty),
  )
);

module.exports = DTRepairer;
