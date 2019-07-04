var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
            creep.say('🔄 harvest');
        }
        if(!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
            creep.memory.upgrading = true;
            creep.say('⚡ upgrade');
        }

        if(creep.memory.upgrading) {
            //if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
            //    creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            //}
            creep.memory.target = "5bbcac819099fc012e635938"
            let controller = Game.getObjectById(creep.memory.target);
            if(creep.upgradeController(controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(controller, {visualizePathStyle: {stroke: '#ffaa00'}, maxRooms:1});
            }
        }
        else {
            var source = creep.findSource();
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}, maxRooms:1});
            }
        }
    }
};

module.exports = roleUpgrader;
