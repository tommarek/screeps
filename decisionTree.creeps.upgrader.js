const DecisionCase = require('decisionCase');


// decisionTree
const DTUpgrader = new DecisionCase(
  true,
  Array(
    new DecisionCase(isEmpty(c), DTUpgraderEmpty),
    new DecisionCase(true, DTUpgraderNotEmpty),
  )
);
const DTUpgraderEmpty = new DecisionCase(
  true,
  Array(
    new DecisionCase(isCloseEnoughToWithdraw(c), actionWithdrawEnergy),
    new DecisionCase(true, actionMoveToGetEnergy),
  ),
  assignTargetWithdrawEnergy
);
const DTUpgraderNotEmpty = new DecisionCase(
  true,
  Array(
    new DecisionCase(isCloseEnoughToUpgrade(c), actionUpgrade),
    new DecisionCase(true, actionMoveToUpgrade),
  ),
  assignTargetUpgrade
);

// checks
const once = (c) => {return true};
const isEmpty = (c) => {c.carry.energy == 0};
const isWithinDistanceToTarget = (c, range) => {
  const task = overseer.getTask(c);
  return c.pos.getRangeTo(task.target) <= range
};
const isCloseEnoughToUpgrade = (c) => {isWithinDistanceToTarget(c, 3)};
const isCloseEnoughToWithdraw = (c) => {isWithinDistanceToTarget(c, 1)};

//targetting
const assignTargetUpgrade = function(c) {
  let task = overseer.tasker.getTask(c);
  task.target = c.findConstruction() || c.findRepair();
  overseer.tasker.setTask(task);
};
const assignTargetWithdrawEnergy = function(c) {
  let task = overseer.tasker.getTask(c);
  task.target = c.findStorage();
  overseer.tasker.setTask(task);
};

// Actions
const actionUpgrade(c) {
  let task = overseer.tasker.getTask(c);
  task.assignUpgrade(
    target = task.target,
    taskEndCondition = isEmpty,
  );
  overseer.tasker.setTask(task);creep
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

const actionMoveToGetEnergy(c) {
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

const actionMoveToUpgrade(c) {
  let task = overseer.tasker.getNewTaskCreep(c);
  task.assignMoveTo(
    target = task.target,
    taskEndCondition = isCloseEnoughToUpgrade,
    taskOptions = {
      visualizePathStyle: {
        stroke: '#ffffff'
      },
    };
  );
  overseer.tasker.setTask(task);
};


module.exports = DTUpgrader;
