const DecisionCase = require('decisionCase');


// decisionTree
const DTBuilder = new DecisionCase(
  true,
  Array(
    new DecisionCase(isEmpty(c), DTBuilderEmpty),
    new DecisionCase(true, DTBuilderNotEmpty),
  )
);
const DTBuilderEmpty = new DecisionCase(
  true,
  Array(
    new DecisionCase(isCloseEnoughToWithdraw(c), actionWithdrawEnergy),
    new DecisionCase(true, actionMoveToGetEnergy),
  ),
  assignTargetWithdrawEnergy
);
const DTBuilderNotEmpty = new DecisionCase(
  true,
  Array(
    new DecisionCase(isCloseEnoughToBuild(c), actionBuild),
    new DecisionCase(true, actionMoveToBuild),
  ),
  assignTargetBuild
);

// checks
const once = (c) => {return true};
const isEmpty = (c) => {c.carry.energy == 0};
const isWithinDistanceToTarget = (c, range) => {
  const task = overseer.getTask(c);
  return c.pos.getRangeTo(task.target) <= range
};
const isCloseEnoughToBuild = (c) => {isWithinDistanceToTarget(c, 3)};
const isCloseEnoughToWithdraw = (c) => {isWithinDistanceToTarget(c, 1)};

//targetting
const assignTargetBuild = function(c) {
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
const actionBuild(c) {
  let task = overseer.tasker.getTask(c);
  task.assignBuild(
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

const actionMoveToBuild(c) {
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


module.exports = DTBuilder;
