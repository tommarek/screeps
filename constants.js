var body_parts_prices = {
  MOVE: 50,
  "move": 50,
  WORK: 100,
  "work": 100,
  CARRY: 50,
  "carry": 50,
  ATTACK: 80,
  "attack": 80,
  RANGED_ATTACK: 150,
  "ranged_attack": 150,
  HEAL: 250,
  "heal": 250,
  CLAIM: 600,
  "claim": 600,
  TOUGH: 10,
  "tough": 10
};

var roles = {
  harvester: {
    code: require('role.harvester'),
    required: 3,
    body: {repeating: [WORK, WORK, CARRY, CARRY, MOVE], fixed: [WORK, CARRY, MOVE]}
  },
  upgrader: {
    code: require('role.upgrader'),
    required: 2,
    body: {repeating: [WORK, WORK, CARRY, CARRY, MOVE], fixed: [WORK, CARRY, MOVE]}
  },
  builder: {
    code: require('role.builder'),
    required: 2,
    body: {repeating: [WORK, WORK, CARRY, CARRY, MOVE], fixed: [WORK, CARRY, MOVE]}
  },
  fixer: {
    code: require('role.fixer'),
    required: 1,
    body: {repeating: [WORK, WORK, CARRY, CARRY, MOVE], fixed: [WORK, CARRY, MOVE]}
  },
};

var repairThreshold = 0.8;
var walkAndRepair = true;
var essentialBodyParts = {WORK: 1, CARRY: 1, MOVE: 1};

module.exports = {
  body_parts_prices: body_parts_prices,
  roles: roles,
  repairThreshold: repairThreshold,
  walkAndRepair: walkAndRepair,
};
