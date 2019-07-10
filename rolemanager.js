module.exports = {
  extend: function(destination, source) {
    for (var k in source) {
      if (!destination.hasOwnProperty(k)) {
        destination[k] = source[k];
      }
    }
    return destination;
  },

  roleExists: function(role) {
    try {
      if (!require("role." + role)) throw "role." + role + " does not exist.";
      return true;
    } catch (e) {
      console.log("Error: Role " + e);
      return false;
    }
  },

  getRole: function(role) {
    if (!this.roleExists(role)) return undefined;
    var roleBase = require('role.base');
    var roleObject = require("role." + role);
    roleObject = this.extend(roleObject, roleBase);
    return roleObject;
  },

  runRoles: function(creeps) {
    for (var name in creeps) {
      var creep = creeps[name];
      if (creep.spawning) continue;

      var role = this.getRole(creep.memory.role);
      if (role) {
        var newRole = Object.create(role);
        newRole.setCreep(creep);
        try {
          newRole.run();
        } catch (e) {}
      }
    }
  }
}
