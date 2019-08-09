'use strict';

const DecisionCase = require('decisionCase');

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
const isCloseEnoughToLoot = function(c) {
  return isWithinDistanceToTarget(c, 1)
};
const isCloseEnoughToPickUp = function(c) {
  return isWithinDistanceToTarget(c, 1)
};

// targetting
const shouldPickupResources = function(c) {
  const roomAnalysis = overseer.getRoomAnalysis(c.room.name);
  if (roomAnalysis.memory.droppedResources) {

    return true;
  }
  return false;
};

const shouldLootTombstones = function(c) {
  const roomAnalysis = overseer.getRoomAnalysis(c.room.name);
  if (roomAnalysis.memory.tombstones) {
    // fix this!!!
    const target = creep.pos.findClosestByPath(
      _.map(roomAnalysis.memory.tombstones, (ts) => {return ts.object})
    );
    let task = overseer.tasker.getTask(c);
    task.assignTarget(target);
    overseer.tasker.setTask(task);
    return true;
  }
  return false;
};

// Actions
const actionLoot = function(c) {
  console.log('idler: looting!');
};

const actionMoveToLoot = function(c) {
  console.log('idler: mooving to loot!');
};

const actionPickUp = function(c) {
  console.log('idler: picking up!');
};

const actionMoveToPickUp = function(c) {
  console.log('idler: moving to pickup!');

};

// decisionTree
const DTIdlerPickUpResources = new DecisionCase(
  true,
  Array(
    new DecisionCase(isCloseEnoughToPickUp, actionPickUp),
    new DecisionCase(true, actionMoveToPickUp),
  ),
);

const DTIdlerLootTombstones = new DecisionCase(
  true,
  Array(
    new DecisionCase(isCloseEnoughToLoot, actionLoot),
    new DecisionCase(true, actionMoveToLoot),
  ),
);

const DTIdler = new DecisionCase(
  true,
  Array(
    new DecisionCase(shouldPickupResources, DTIdlerPickUpResources),
    new DecisionCase(shouldLootTombstones, DTIdlerLootTombstones),
    new DecisionCase(true, (c) => {return -1}),
  ),
);


module.exports = DTIdler;
