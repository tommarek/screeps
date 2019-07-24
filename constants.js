const constants = {
  body_parts_prices: {
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
  },

  processes: {
    INIT: 'process.init',
    TASKER: 'process.tasker',
  },

  roles: {
    // harvester: {
    //   code: require('role.harvester'),
    //   required: 0,
    //   body: {
    //     repeating: [WORK, WORK, CARRY, CARRY, MOVE],
    //     fixed: [WORK, CARRY, MOVE]
    //   }
    // },
    distanceharvester: {
      code: require('role.distanceharvester'),
      required: 2,
      body: {
        repeating: [WORK, CARRY, CARRY, MOVE, MOVE],
        fixed: [CARRY, MOVE]
      }
    },
    hauler: {
      code: require('role.hauler'),
      required: 1,
      body: {
        repeating: [CARRY, CARRY, MOVE],
        fixed: [WORK, CARRY, MOVE]
      }
    },
    upgrader: {
      code: require('role.upgrader'),
      required: 1,
      body: {
        repeating: [WORK, WORK, CARRY, CARRY, MOVE],
        fixed: [WORK, CARRY, MOVE]
      }
    },
    builder: {
      code: require('role.builder'),
      required: 1,
      body: {
        repeating: [WORK, WORK, CARRY, CARRY, MOVE],
        fixed: [WORK, CARRY, MOVE]
      }
    },
    fixer: {
      code: require('role.fixer'),
      required: 0,
      body: {
        repeating: [WORK, WORK, CARRY, CARRY, MOVE],
        fixed: [WORK, CARRY, MOVE]
      }
    },
    miner: {
      code: require('role.miner'),
      required: 2,
      body: {
        repeating: [WORK],
        fixed: [CARRY, MOVE, MOVE, MOVE]
      }
    },
    dumptruck: {
      code: require('role.dumptruck'),
      required: 2,
      body: {
        repeating: [CARRY, CARRY, MOVE],
        fixed: [WORK, CARRY, MOVE]
      }
    },
  },

  repairThreshold: 0.8,
  walkAndRepair: true,
  essentialBodyParts: {
    WORK: 1,
    CARRY: 1,
    MOVE: 1
  },
};

module.exports = constants;
