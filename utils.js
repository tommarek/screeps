'use strict';

const utils = {
  encodePosition: function(position) {
    return position.x + 'x' + position.y + '@' + position.roomName;
  },

  decodePosition: function(encodedPosition) {
    var reGroups = encodedPosition.match(/^(\d+)x(\d+)@(.*)$/);
    if (reGroups) return new RoomPosition(reGroups[1], reGroups[2], reGroups[3]);
    return undefined;
  },

  // extend destination class with source one
  extend: function(destination, source) {
    for (var k in source) {
      if (!destination.hasOwnProperty(k)) {
        destination[k] = source[k];
      }
    }
    return destination;
  },

  calcResourceTTD: function(amount, ticks = 0) {
    const newAmount = ceil(amount / 1000);
    if (newAmount >= 1) return this.calcTicksToDecay(ticks + 1, newAmount);
    return newAmount;
  }
}

module.exports = utils;
