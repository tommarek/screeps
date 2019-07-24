const DecisionCase = require('decisionCase');


// decisionTree
const DTHauler = new DecisionCase(
  true,
  Array(
    new DecisionCase(isEmpty(c), DTHaulerEmpty),
    new DecisionCase(true, DTHaulerNotEmpty),
  )
);
const DTHaulerEmpty = new DecisionCase(
  true,
  Array(
    new DecisionCase(isCloseEnoughToWithdraw(c), actionWithdrawEnergy),
    new DecisionCase(true, actionMoveToWithdraw),
  ),
  assignTargetWithdrawEnergy
);
const DTHaulerNotEmpty = new DecisionCase(
  true,
  Array(
    new DecisionCase(isCloseEnoughToTransfer(c), actionTransfer),
    new DecisionCase(true, actionMoveToTransfer),
  ),
  assignTargetStore
);

// checks
const once = (c) => {return true};
const isEmpty = (c) => {c.carry.energy == 0};
const isWithinDistanceToTarget = (c, range) => {
  const task = overseer.getTask(c);
  return c.pos.getRangeTo(task.target) <= range
};
const isCloseEnoughToTransfer = (c) => {isWithinDistanceToTarget(c, 1)};
const isCloseEnoughToWithdraw = (c) => {isWithinDistanceToTarget(c, 1)};

//targetting
const assignTargetStore = function(c) {
  let task = overseer.tasker.getTask(c);
  task.target = c.findTransferTarget();
  overseer.tasker.setTask(task);
};
const assignTargetWithdrawEnergy = function(c) {
  let task = overseer.tasker.getTask(c);
  task.target = c.findStorage();
  overseer.tasker.setTask(task);
};

// Actions
const actionTransfer(c) {
  let task = overseer.tasker.getTask(c);
  task.assignTransfer(
    target = task.target,
    taskEndCondition = isEmpty,
    resourceType = RESOURCE_ENERGY,
    amount = c.carryCapacity,
  );
  overseer.tasker.setTask(task);
};

const actionWithdrawEnergy(c) {
  let task = overseer.tasker.getTask(c);
  task.assignWithdaw(
    target = task.target,
    taskEndCondition = once
    resourceType = RESOURCE_ENERGY,
    amount = c.carryCapacity,
  );
  overseer.tasker.setTask(task);
};

const actionMoveToWithdraw(c) {
  let task = overseer.tasker.getTask(c);
  task.assignMoveTo(
    target = task.target,
    taskEndCondition = isCloseEnoughToWithdraw,
    taskOptions = {
      visualizePathStyle: {
        stroke: '#ffffff'
      },
    };
  );
  overseer.tasker.setTask(task);
};

const actionMoveToTransfer(c) {
  let task = overseer.tasker.getNewTaskCreep(c);
  task.assignMoveTo(
    target = task.target,
    taskEndCondition = isCloseEnoughToTransfer,
    taskOptions = {
      visualizePathStyle: {
        stroke: '#ffffff'
      },
    };
  );
  overseer.tasker.setTask(task);
};


module.exports = DTHauler;
