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
    body: [WORK, WORK, CARRY, MOVE, MOVE]
  },
  upgrader: {
    code: require('role.upgrader'),
    required: 3,
    body: [WORK, CARRY, MOVE, MOVE, MOVE]
  },
  builder: {
    code: require('role.builder'),
    required: 1,
    body: [WORK, WORK, CARRY, MOVE, MOVE]
  },
};


module.exports = {
  body_parts_prices: body_parts_prices,
  roles: roles,
};
