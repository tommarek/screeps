const DecisionCase = require('decisionCase');

const DTBuilder = require('decisionTree.creeps.builder');
//const DTDistanceHarvester = require('decisionTree.creeps.distanceharvester');
const DTDumpTruck = require('decisionTree.creeps.dumptruck');
const DTFixer = require('decisionTree.creeps.fixer');
const DTHarvester = require('./decisionTree.creeps.builder');
const DTHauler = require('decisionTree.creeps.hauler');
const DTMiner = require('decisionTree.creeps.miner');
const DTUpgrader = require('decisionTree.creeps.upgrader');

const DTCreeps = new DecisionCase(
  true, Array(
    new DecisionCase((c, d) => c.memory.role == 'distanceharvester', DTHarvester),
    //new DecisionCase((c, d) => c.memory.role == 'miner', DTDistanceHarvester),
    new DecisionCase((c, d) => c.memory.role == 'dumptruck', DTDumpTruck),
    new DecisionCase((c, d) => c.memory.role == 'fixer', DTFixer),
    new DecisionCase((c, d) => c.memory.role == 'harvester', DTHarvester),
    new DecisionCase((c, d) => c.memory.role == 'hauler', DTHauler),
    new DecisionCase((c, d) => c.memory.role == 'miner', DTMiner),
    new DecisionCase((c, d) => c.memory.role == 'upgrader', DTUpgrader),
  )
)

module.exports = DTCreeps;
