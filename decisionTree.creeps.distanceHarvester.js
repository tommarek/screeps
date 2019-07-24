const DecisionCase = require('decisionCase');


// decisionTree
const DTDistanceHarvester = new DecisionCase(
  true,
  Array(
    new DecisionCase(isEmpty(c), DTDistanceHarvesterEmpty),
    new DecisionCase(true, DTDistanceHarvesterNotEmpty),
  )
);
const DTDistanceHarvesterEmpty = new DecisionCase(
  true,
  Array(
    new DecisionCase(isCloseEnoughToHarvest(c), actionHarvestEnergy),
    new DecisionCase(true, actionMoveToSource),
  ),
  assignTargetHarvest
);
const DTDistanceHarvesterNotEmpty = new DecisionCase(
  true,
  Array(
    new DecisionCase(isCloseEnoughToTransfer(c), actionTransfer),
    new DecisionCase(true, actionMoveToTransfer),
  ),
  assignTargetTransfer
);

// checks
const once = (c) => {return true};
const isEmpty = (c) => {c.carry.energy == 0};
const isFull = (c) => {_.sum(c.carry) == c.carryCapacity};
const isWithinDistanceToTarget = (c, range) => {
  const task = overseer.getTask(c);
  return c.pos.getRangeTo(task.target) <= range
};
const isCloseEnoughToHarvest = (c) => {isWithinDistanceToTarget(c, 1)};
const isCloseEnoughToTransfer = (c) => {isWithinDistanceToTarget(c, 1)};

//targetting
const assignTargetTransfer = function(c) {
  let task = overseer.tasker.getTask(c);
  task.target = c.findStorage();
  overseer.tasker.setTask(task);
};
const assignTargetHarvest = function(c) {
  let task = overseer.tasker.getTask(c);
  task.target = c.findSource();
  overseer.tasker.setTask(task);
};

// Actions
const actionTransfer(c) {
  let task = overseer.tasker.getTask(c);
  task.assignTransfer(
    target = task.target,
    taskEndCondition = once,
  );
  overseer.tasker.setTask(task);
};

const actionHarvestEnergy(c) {
  let task = overseer.tasker.getTask(c);
  task.assignHarvest(
    target = task.target,
    taskEndCondition = isFull,
  );
  overseer.tasker.setTask(task);
};

const actionMoveToSource(c) {
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

const actionMoveToTransfer(c) {
  let task = overseer.tasker.getNewTaskCreep(c);
  task.assignMoveTo(
    target = task.target,
    taskEndCondition = isCloseEnoughToBuild,
    taskOptions = {
      visualizePathStyle: {
        stroke: '#ffffff'
      },
    }
  );
  overseer.tasker.setTask(task);
};

module.exports = DTDistanceHarvester;
