'use strict';

const Miner = function(o) {
  this.locationDetails = {}
  this.unassignedFlags = {}

  this.logger = o.getLogger('miner');
}

Miner.prototype.getMiningFlags = function() {
  const miningFlags = _.filter(Games.flags, (flagName) => {Game.flags[flagName].color == COLOR_WHITE});
};

Miner.prototype.placeMiningFlag = function(sourceID) {

}

Miner.prototype.loadLocationDetails = function(flagName) {

}


module.exports = Miner;
