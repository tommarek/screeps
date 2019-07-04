var body_parts_prices = {
  MOVE: 50,
  WORK: 100,
  CARRY: 50,
  ATTACK: 80,
  RANGED_ATTACK: 150,
  HEAL: 250,
  CLAIM: 600,
  TOUGH: 10
};

var roles = {
  harvester: {
    code: require('role.harvester'),
    required: 3,
    body: [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE]
  },
  upgrader: {
    code: require('role.upgrader'),
    required: 2,
    body: [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE]
  },
  builder: {
    code: require('role.builder'),
    required: 2,
    body: [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE]
  },
  fixer: {
    code: require('role.fixer'),
    required: 1,
    body: [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE]
  },
};

var repairThreshold = 0.8;

module.exports = {
  body_parts_prices: body_parts_prices,
  roles: roles,
  repairThreshold: repairThreshold,
};
