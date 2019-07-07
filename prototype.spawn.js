StructureSpawn.prototype.createCustomCreep = function(body, name, memory) {
  if (this.spawning) {
    return true;
  }

  if (!Game.creeps[name]) {
    this.spawnCreep(body, name, memory);
  }
};

StructureSpawn.prototype.genBody = function(repeating={}, fixed={}, costLimit=this.room.energyAvailable) {
  let body = [];
  let fixedBodyPrice = 0;
  for (let bodyPart in fixed) {
    fixedBodyPrice += constants.body_parts_prices[bodyPart] * fixed[bodyPart];
    for (let i = 0; i < fixed[bodyPart]; i++) {
      body.push(bodyPart);
    }
  }
  let remainingEnergy = costLimit - fixedBodyPrice;

  let repeatingBody = [];
  let repeatingBodyPrice = 0;
  for (let bodyPart in repeating) {
    repeatingBodyPrice += constants.body_parts_prices[bodyPart] * repeating[bodyPart];
    for (let i = 0; i < repeating[bodyPart]; i++) {
      repeatingBody.push(bodyPart);
    }
  }

  var repeated = remainingEnergy / repeatingBodyPrice;
  for (let i = 0; i < repeated; i++) {
    body = body.concat(repeatingBody);
  }

  // fill with the rest maybe?

  return body;
}
