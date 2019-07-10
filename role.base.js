module.exports = {
  creep: null,
  repeatingBody: [],
  fixedBody: [],
  setCreep: function(creep) {
    this.creep = creep
  },
  run: function() {
    if (this.creep.memory.initialised = undefined) {
      this.constructor();
      this.creep.memory.initialised = true;
    }
    this.action(this.creep);
  },
  constructor: function() {},
  destructor: function() {},
  genParts: function(costLimit) {
    let body = [];

    let fixedBodyPrice = 0;
    for (let i in this.fixedBody) {
      let bodyPart = this.fixedBody[i];
      fixedBodyPrice += constants.body_parts_prices[bodyPart];
      body.push(bodyPart);
    }
    let remainingEnergy = costLimit - fixedBodyPrice;

    if (this.repeatingBody.length > 0) {
      let repeatingBodyPrice = 0;
      for (let i in this.repeatingBody) {
        let bodyPart = this.repeatingBody[i];
        repeatingBodyPrice += constants.body_parts_prices[bodyPart]
      }

      var repeated = remainingEnergy / repeatingBodyPrice;
      for (let i = 0; i < repeated - 1; i++) {
        for (let j = 0; j < this.repeatingBody.length; j++) {
          body.push(this.repeatingBody[j]);
        }
      }
    }
  }
}
