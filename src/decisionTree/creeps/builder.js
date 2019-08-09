'use strict';

const DecisionCase = require('decisionCase');
const DTIdler = require('decisionTree.creeps.idler');

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
const cantBuildOrRepair = function(c) {
  const task = overseer.tasker.getTask(c);
  if (task.lastReturn != OK || isEmpty(c)) {
    return true;
  }
  return false;
}

// targetting
const shouldBuild = function(c) {
  if (isEmpty(c)) return false;
  const target = c.findConstruction();
  if (target) {
    let task = overseer.tasker.getTask(c);
    task.assignTarget(target);
    overseer.tasker.setTask(task);
    return true;
  }
  return false;
};

const shouldRepair = function(c) {
  if (isEmpty(c)) return false;
  const target = c.findRepair();
  if (target) {
    let task = overseer.tasker.getTask(c);
    task.assignTarget(target);
    overseer.tasker.setTask(task);
    return true;
  }
  return false;
};

const shouldWithdraw = function(c) {
  if (!isEmpty(c)) return false;

  const target = c.pos.findClosestByRange(FIND_STRUCTURES, {
    filter: (s) => s.structureType == STRUCTURE_CONTAINER || s.structureType == STRUCTURE_STORAGE && s.store[RESOURCE_ENERGY] > 0
  });
  if (target) {
    let task = overseer.tasker.getTask(c);
    task.assignTarget(target);
    overseer.tasker.setTask(task);
    return true;
  }
  return false;
};

// Actions
const actionBuild = function(c) {
  let task = overseer.tasker.getTask(c);
  task.assignBuild(
    task.target,
    cantBuildOrRepair
  );
  overseer.tasker.setTask(task);
};

const actionRepair = function(c) {
  let task = overseer.tasker.getTask(c);
  task.assignRepair(
    task.target,
    cantBuildOrRepair
  );
  overseer.tasker.setTask(task);
};

const actionWithdraw = function(c) {
  let task = overseer.tasker.getTask(c);
  task.assignWithdraw(
    task.target,
    once,
    RESOURCE_ENERGY
  );
  overseer.tasker.setTask(task);
};

const actionMoveToWithdraw = function(c) {
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
const DTBuilderBuild = new DecisionCase(
  true,
  Array(
    new DecisionCase(isCloseEnoughToBuild, actionBuild),
    new DecisionCase(true, actionMoveToBuild),
  )
);
const DTBuilderRepair = new DecisionCase(
  true,
  Array(
    new DecisionCase(isCloseEnoughToBuild, actionRepair),
    new DecisionCase(true, actionMoveToBuild),
  )
);
const DTBuilderWIthdraw = new DecisionCase(
  true,
  Array(
    new DecisionCase(isCloseEnoughToWithdraw, actionWithdraw),
    new DecisionCase(true, actionMoveToWithdraw),
  ),
);
const DTBuilder = new DecisionCase(
  true,
  Array(
    new DecisionCase(shouldBuild, DTBuilderBuild),
    new DecisionCase(shouldRepair, DTBuilderRepair),
    new DecisionCase(shouldWithdraw, DTBuilderWIthdraw),
    new DecisionCase(true, DTIdler),
  )
);

module.exports = DTBuilder;
