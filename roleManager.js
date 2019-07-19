'use strict';

const RoleBase = require('role');
const utils = require('utils');

const RoleManager = function(roles = []) {
  this.stats = {};
  this.roles = {};
  _.each(roles, role => {
    var RoleObject = require("role." + role);
    RoleObject = utils.extend(RoleObject, RoleBase);
    this.roles[role] = RoleObject;
  });
}

RoleManager.prototype.addRole = function(role) {
  var roleObject = require("role." + role);
  roleObject = utils.extend(roleObject, roleBase);
  this.roles[role] = roleObject;
}

RoleManager.prototype.initTick = function() {

}

// TODO do something with the timing
RoleManager.prototype.runRoleCreep = function(creepID) {
  const creep = Game.getObjectById(creepID)
  if (creep.spawning) return;

  const role = creep.memory.role;
  if (!role || !this.roles[role]) return;

  const startTime = Game.cpu.getUsed;
  this.stats.total += 1;
  this.stats[role] += 1;
  var newRole = Object.create(this.roles[role]);
  newRole.setCreep(creep);
  try {
    newRole.run();
  } catch (e) {}
  const stopTime = Game.cpu.getUsed;

}

RoleManager.prototype.runRoleCreeps = function(creepIDs) {
  _.each(creepIDs, creepID => this.runRoleCreep(creepID));
}

module.exports = RoleManager;
