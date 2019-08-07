'use strict';

const DecisionCase = require('decisionCase');

const DTBuilder = require('decisionTree.creeps.builder');
//const DTDistanceHarvester = require('decisionTree.creeps.distanceharvester');
const DTDumpTruck = require('decisionTree.creeps.dumptruck');
const DTHarvester = require('decisionTree.creeps.builder');
const DTHauler = require('decisionTree.creeps.hauler');
const DTMiner = require('decisionTree.creeps.miner');
const DTRepairer = require('decisionTree.creeps.repairer');
const DTUpgrader = require('decisionTree.creeps.upgrader');

const DTCreeps = new DecisionCase(
  true, Array(
    new DecisionCase((c) => c.memory.role == 'builder', DTBuilder),
    //new DecisionCase((c) => c.memory.role == 'distanceharvester', DTHarvester),
    new DecisionCase((c) => c.memory.role == 'dumptruck', DTDumpTruck),
    new DecisionCase((c) => c.memory.role == 'harvester', DTHarvester),
    new DecisionCase((c) => c.memory.role == 'hauler', DTHauler),
    new DecisionCase((c) => c.memory.role == 'miner', DTMiner),
    new DecisionCase((c) => c.memory.role == 'repairer', DTRepairer),
    new DecisionCase((c) => c.memory.role == 'upgrader', DTUpgrader),
  ),
)

module.exports = DTCreeps;
