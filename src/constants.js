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
    BUILDER: 'process.builder',
    MINER: 'process.miner',
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
    // distanceharvester: {
    //   required: 2,
    //   body: {
    //     repeating: [WORK, CARRY, CARRY, MOVE, MOVE],
    //     fixed: [CARRY, MOVE]
    //   }
    // },
    hauler: {
      required: 2,
      body: {
        repeating: [CARRY, CARRY, MOVE],
        fixed: [WORK, CARRY, MOVE]
      }
    },
    upgrader: {
      required: 1,
      body: {
        repeating: [WORK, WORK, CARRY, CARRY, MOVE],
        fixed: [WORK, CARRY, MOVE]
      }
    },
    builder: {
      required: 1,
      body: {
        repeating: [WORK, WORK, CARRY, CARRY, MOVE],
        fixed: [WORK, CARRY, MOVE]
      }
    },
    fixer: {
      required: 0,
      body: {
        repeating: [WORK, WORK, CARRY, CARRY, MOVE],
        fixed: [WORK, CARRY, MOVE]
      }
    },
    miner: {
      required: 2,
      body: {
        repeating: [WORK],
        fixed: [WORK, MOVE, MOVE, MOVE]
      }
    },
    dumptruck: {
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
