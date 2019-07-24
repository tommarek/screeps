const DecisionCase = require('decisionCase');


// decisionTree
const DTRepairer = new DecisionCase(
  true,
  Array(
    new DecisionCase(isEmpty(c), DTRepairerEmpty),
    new DecisionCase(true, DTRepairerNotEmpty),
  )
);
const DTRepairerEmpty = new DecisionCase(
  true,
  Array(
    new DecisionCase(isCloseEnoughToWithdraw(c), actionWithdrawEnergy),
    new DecisionCase(true, actionMoveToGetEnergy),
  ),
  assignTargetWithdrawEnergy
);
const DTRepairerNotEmpty = new DecisionCase(
  true,
  Array(
    new DecisionCase(isCloseEnoughToRepair(c), actionRepair),
    new DecisionCase(true, actionMoveToRepair),
  ),
  assignTargetRepair
);

// checks
const once = (c) => {return true};
const isEmpty = (c) => {c.carry.energy == 0};
const isWithinDistanceToTarget = (c, range) => {
  const task = overseer.getTask(c);
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
const actionRepair(c) {
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

const actionWithdrawEnergy(c) {
  let task = overseer.tasker.getTask(c);
  task.assignWithdaw(
    target = task.target,
    taskEndCondition = once,
    resourceType = RESOURCE_ENERGY,
    amount = c.carryCapacity,
  );
  overseer.tasker.setTask(task);
};

const actionMoveToGetEnergy(c) {
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

const actionMoveToRepair(c) {
  let task = overseer.tasker.getNewTaskCreep(c);
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


module.exports = DTRepairer;
