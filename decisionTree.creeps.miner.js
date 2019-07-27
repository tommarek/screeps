'use strict';

const DecisionCase = require('decisionCase');
const utils = require('utils');

// checks
const once = (c) => {return true};
const isEmpty = (c) => {return c.carry.energy == 0};
const isFull = (c) => {return _.sum(c.carry) == c.carryCapacity};
const isWithinDistanceToTarget = (c, range) => {
  const task = overseer.tasker.getTask(c);
  return c.pos.getRangeTo(task.target) <= range
};
const isCloseEnoughToHarvest = (c) => {isWithinDistanceToTarget(c, 1)};
const isCloseEnoughToTransfer = (c) => {isWithinDistanceToTarget(c, 1)};

// store assigned spots to the memory - this will only be done once
const storeMiningPosition = function(c) {
  if (!overseer.tasker.memory.miners) overseer.tasker.memory.miners = {};
  if (overseer.tasker.memory.miners[c.name]) {
    return true;
  } else {
    overseer.tasker.memory.miners[c.name] = {};
  }

  const sources = overseer.getRoomAnalysis(c.pos.roomName).memory.sources;
  _.each(sources, (s) => {
    var sourcePos = utils.decodePosition(s.pos);
    var spotsAroundSource = sourcePos.getAdjacentEnterable();

    var containers = sourcePos.findInRange(FIND_STRUCTURES, 1, {
      filter: (s) => s.structureType == STRUCTURE_CONTAINER
    });

    overseer.tasker.memory.miners[c.name].source = Game.getObjectById(s.id);
    if (containers.length > 0) {
      var container = containers[0];
      coverseer.tasker.memory.miners[c.name].pos = utils.encodePosition(container.pos);
      overseer.tasker.memory.miners[c.name].container = container;
    } else {
      overseer.tasker.memory.miners[c.name].pos = utils.encodePosition(spotsAroundSource[0]);
      overseer.tasker.memory.miners[c.name].container = undefined;
    };
    return true;
  });
  return false;
};

// Actions
const actionTransfer = function(c) {
  let task = overseer.tasker.getTask(c);
  task.assignTransfer(
    overseer.tasker.memory.miners[c.name].container,
    once,
  );
  overseer.tasker.setTask(task);
};

const actionHarvestEnergy = function(c) {
  let task = overseer.tasker.getTask(c);
  task.assignHarvest(
    overseer.tasker.memory.miners[c.name].source,
    isFull,
  );
  overseer.tasker.setTask(task);
};

const actionMoveToSource = function(c) {
  let task = overseer.tasker.getTask(c);
  task.assignMoveTo(
    utils.decodePosition(overseer.tasker.memory.miners[c.name].pos),
    isCloseEnoughToHarvest,
    {
      visualizePathStyle: {
        stroke: '#ffffff'
      },
    }
  );
  overseer.tasker.setTask(task);
};

const actionMoveToTransfer = function(c) {
  let task = overseer.tasker.getTask(c);
  task.assignMoveTo(
    utils.decodePosition(overseer.tasker.memory.miners[c.name].pos),
    isCloseEnoughToTransfer,
    {
      visualizePathStyle: {
        stroke: '#ffffff'
      },
    }
  );
  overseer.tasker.setTask(task);
};

// decisionTree
const DTMinerEmpty = new DecisionCase(
  true,
  Array(
    new DecisionCase(isCloseEnoughToHarvest, actionHarvestEnergy),
    new DecisionCase(true, actionMoveToSource),
  )
);
const DTMinerNotEmpty = new DecisionCase(
  true,
  Array(
    new DecisionCase(isCloseEnoughToTransfer, actionTransfer),
    new DecisionCase(true, actionMoveToTransfer),
  )
);
const DTMiner = new DecisionCase(
  true,
  Array(
    new DecisionCase(isEmpty, DTMinerEmpty),
    new DecisionCase(true, DTMinerNotEmpty),
  ),
  storeMiningPosition
);

module.exports = DTMiner;
