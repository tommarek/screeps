const DecisionCase = require('decisionCase');


// decisionTree
const DTMiner = new DecisionCase(
  true,
  Array(
    new DecisionCase(isEmpty(c), DTMinerEmpty),
    new DecisionCase(true, DTMinerNotEmpty),
  ),
  storeMiningPosition
);
const DTMinerEmpty = new DecisionCase(
  true,
  Array(
    new DecisionCase(isCloseEnoughToHarvest(c), actionHarvestEnergy),
    new DecisionCase(true, actionMoveToSource),
  )
);
const DTMinerNotEmpty = new DecisionCase(
  true,
  Array(
    new DecisionCase(isCloseEnoughToTransfer(c), actionTransfer),
    new DecisionCase(true, actionMoveToTransfer),
  )
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

// store assigned spots to the memory - this will only be done once
const storeMiningPosition = function(c) {
  if (overseer.tasker.memory.miners[c.creepName]) return true;

  const sources = overseer.getRoomAnalysis(c.room.roomName).sources;
  _.each(sources, (s) => {
    var sourcePos = utils.decodePosition(source.pos);
    var spotsAroundSource = sourcePos.getAdjacentEnterable();

    var containers = source.pos.findInRange(FIND_STRUCTURES, 1, {
      filter: (s) => s.structureType == STRUCTURE_CONTAINER
    });
    overseer.tasker.memory.miners[c.creepName].source = Game.getObjectById(source.id);
    if (containers.length > 0) {
      var container = containers[0];
      coverseer.tasker.memory.miners[c.creepName].pos = container.pos;
      overseer.tasker.memory.miners[c.creepName].container = container;
    } else {
      overseer.tasker.memory.miners[c.creepName].pos = spotsAroundSource[0];
      overseer.tasker.memory.miners[c.creepName].container = undefined;
    };
    return true;
  });
  return false;
};

// Actions
const actionTransfer(c) {
  let task = overseer.tasker.getTask(c);
  task.assignTransfer(
    target = overseer.tasker.memory.miners[c.creepName].container,
    taskEndCondition = once,
  );
  overseer.tasker.setTask(task);
};

const actionHarvestEnergy(c) {
  let task = overseer.tasker.getTask(c);
  task.assignHarvest(
    target = overseer.tasker.memory.miners[c.creepName].source,
    taskEndCondition = isFull,
  );
  overseer.tasker.setTask(task);
};

const actionMoveToSource(c) {
  let task = overseer.tasker.getTask(c);
  task.assignMoveTo(
    target = overseer.tasker.memory.miners[c.creepName].pos,
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
    target = overseer.tasker.memory.miners[c.creepName].pos,
    taskEndCondition = isCloseEnoughToBuild,
    taskOptions = {
      visualizePathStyle: {
        stroke: '#ffffff'
      },
    }
  );
  overseer.tasker.setTask(task);
};

module.exports = DTMiner;
