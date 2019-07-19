'use strict';

const Process = require('process');
const RoleManager = require('roleManager')

const creepRoles = [
  'builder',
  'distanceharvester',
  'dumptruck',
  'fixer',
  'harvester',
  'hauler',
  'miner',
  'upgrader',
]

const ProcessCreeps = function(params) {
  Process.call(params);

  this.roleManager = new RoleManager(creepRoles);
}

ProcessCreeps.prototype = Object.create(Process.prototype);

ProcessCreeps.prototype.run = function() {
  this.roleManager.initTick();
  _.each(Game.creepsByRole, (creeps, role) => {
    overseer.runSubprocess('role.' + role, () => {
      console.log('role: ' + role + ', creeps:' + creeps)
      this.roleManager.runRoleCreeps(creeps);
    });
  });
}

module.exports = ProcessCreeps;
