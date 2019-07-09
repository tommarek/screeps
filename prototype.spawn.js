var constants = require('constants');

StructureSpawn.prototype.createCustomCreep = function(body, name, memory) {
  if (this.spawning) {
    return true;
  }

  if (!Game.creeps[name]) {
    console.log(this.spawnCreep(body, name, memory));
  }
};

StructureSpawn.prototype.genBody = function(repeating=[], fixed=[], costLimit=this.room.energyAvailable) {
  let body = [];

  let fixedBodyPrice = 0;
  for (let i in fixed) {
    let bodyPart = fixed[i];
    fixedBodyPrice += constants.body_parts_prices[bodyPart];
    body.push(bodyPart);
  }
  let remainingEnergy = costLimit - fixedBodyPrice;

  let repeatingBodyPrice = 0;
  for (let i in repeating) {
    let bodyPart = repeating[i];
    repeatingBodyPrice += constants.body_parts_prices[bodyPart]
  }

  var repeated = remainingEnergy / repeatingBodyPrice;
  for (let i = 0; i < repeated - 1; i++) {
      for (let j = 0; j < repeating.length; j++){
          body.push(repeating[j]);
      }
  }

  // fill with the rest maybe?

  return body;
}
