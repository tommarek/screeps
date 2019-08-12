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
  };
  return false;
};

// targetting
const shouldBuild = function(c) {
  if (isEmpty(c)) return false;
  const target = c.findConstruction();
  if (target) {
    overseer.tasker.setCreepTarget(c.name, target.id);
    return true;
  };
  return false;
};

const shouldRepair = function(c) {
  if (isEmpty(c)) return false;
  const target = c.findRepair();
  if (target) {
    overseer.tasker.setCreepTarget(c.name, target.id);
    return true;
  };
  return false;
};

const shouldWithdraw = function(c) {
  if (!isEmpty(c)) return false;
  const target = c.pos.findClosestByRange(FIND_STRUCTURES, {
    filter: (s) => s.structureType == STRUCTURE_CONTAINER || s.structureType == STRUCTURE_STORAGE && s.store[RESOURCE_ENERGY] > 0
  });
  if (target) {
    overseer.tasker.setCreepTarget(c.name, target.id);
    return true;
  };
  return false;
};

// Actions
const actionBuild = function(c) {
  let task = new Task(c);
  task.assignBuild(
    overseer.tasker.getCreepTarget(c.name),
    cantBuildOrRepair
  );
  overseer.tasker.setTask(task);
};

const actionRepair = function(c) {
  let task = new Task(c);
  task.assignRepair(
    overseer.tasker.getCreepTarget(c.name),
    cantBuildOrRepair
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

const actionMoveToBuild = function(c) {
  let task = new Task(c);
  task.assignMoveTo(
    overseer.tasker.getCreepTarget(c.name),
    isCloseEnoughToBuild, {
      visualizePathStyle: {
        stroke: '#ffffff'
      },
    }
  );
  overseer.tasker.setTask(task);
};

// decisionTree
const DTBuild = new DecisionCase(
  true,
  Array(
    new DecisionCase(isCloseEnoughToBuild, actionBuild),
    new DecisionCase(true, actionMoveToBuild),
  )
);
const DTRepair = new DecisionCase(
  true,
  Array(
    new DecisionCase(isCloseEnoughToBuild, actionRepair),
    new DecisionCase(true, actionMoveToBuild),
  )
);
const DTWithdraw = new DecisionCase(
  true,
  Array(
    new DecisionCase(isCloseEnoughToWithdraw, actionWithdraw),
    new DecisionCase(true, actionMoveToWithdraw),
  ),
);
const DTBuilder = new DecisionCase(
  true,
  Array(
    new DecisionCase(shouldBuild, DTBuild),
    new DecisionCase(shouldRepair, DTRepair),
    new DecisionCase(shouldWithdraw, DTWithdraw),
    new DecisionCase(true, overseer.tasker.addIdler),
  )
);

module.exports = DTBuilder;
