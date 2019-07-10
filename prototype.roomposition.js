RoomPosition.prototype.isEnterable = function () {
  var atPos = this.look();
  var SWAMP = "swamp";
  var PLAIN = "plain";
  for ( var i = 0 ; i < atPos.length ; i++ ) {
    switch (atPos[i].type) {
      case LOOK_TERRAIN:
        if (atPos[i].terrain != PLAIN && atPos[i].terrain != SWAMP)
          return false;
        break;
      case LOOK_STRUCTURES:
        if (OBSTACLE_OBJECT_TYPES.includes(atPos[i].structure.structureType))
          return false;
        break;
      case LOOK_CREEPS:
      case LOOK_SOURCES:
      case LOOK_MINERALS:
      case LOOK_NUKES:
      case LOOK_ENERGY:
      case LOOK_RESOURCES:
      case LOOK_FLAGS:
      case LOOK_CONSTRUCTION_SITES:
      default:
    }
  }
  return true;
}

RoomPosition.prototype.getAdjacent = function () {
  var ret = [];
  for (var i = -1; i < 2; i++) {
    for (var j = -1; j < 2; j++) {
      var x = this.x + i;
      var y = this.y + j;
      if (x >= 0 && x < 50 && y >= 0 && y < 50 && (x != this.x || y != this.y)) {
        var newPos = new RoomPosition(x=x, y=y, roomName=this.roomName);
        ret.push(newPos);
      }
    }
  }
  return ret;
}


RoomPosition.prototype.getAdjacentxEnterable = function() {
  var ret = [];
  var adjacent = this.getAdjacent();
  for (var i in adjacent) {
    if (adjacent[i].isEnterable()){
      ret.push(adjacent[i]);
    }
  }
  return ret;
}
