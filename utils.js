'use strict';

const utils = {
  encodePosition(position) {
    return position.x + 'x' + position.y + '@' + position.roomName;
  },

  decodePosition(encodedPosition) {
    var reGroups = encodedPosition.match(/^(\d+)x(\d+)@(.*)$/);
    if (reGroups) return new RoomPosition(reGroups[1], reGroups[2], reGroups[3]);
    return undefined;
  },

  // extend destination class with source one
  extend(destination, source) {
    for (var k in source) {
      if (!destination.hasOwnProperty(k)) {
        destination[k] = source[k];
      }
    }
    return destination;
  },
}

module.exports = utils;
