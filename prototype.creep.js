var constants = require('constants');

module.exports = function () {
    Creep.prototype.runRole = function () {
        constants.roles[this.memory.role].code.run(this)
    };
    
    Creep.prototype.findSource = function () {
        var source = this.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
        if (source) {
            if (this.moveTo(source) !== ERR_NO_PATH) {
                if (source.id) {
                    this.memory.source = source.id;
                    return source;
                }
            }
        }
        return null;
    };
    
    Creep.prototype.setLastPosition = function () {
        this.memory.lastPosition = this.pos;
    };
    
    Creep.prototype.didWeMove = function () {
        return this.memory.lastPosition == this.pos;
    };
};
