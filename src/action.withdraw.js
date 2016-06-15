'use strict';

var utilities = require('utilities');

module.exports = function(name, required_body_components) {
   var withdraw_structure_types = [
      STRUCTURE_EXTENSION,
      STRUCTURE_SPAWN,
   ];

   return {
      withdraw_structure_types: withdraw_structure_types,
      get_withdraw_targets: utilities.get_withdraw_targets,
      run: function(creep) {
         var withdraw_targets = utilities.get_withdraw_targets(creep.room);
         if (withdraw_targets.length > 0) {
            // TODO: Prioritize targets by distance to creep.
            var withdraw = withdraw_targets[0];
            var creep_energy_deficit = creep.carryCapacity - creep.carry.energy;
            var transfer_amount = Math.min(
                  Math.max(withdraw.target.energy, creep_energy_deficit),
                  withdraw.surplus);

            if (withdraw.target.transferEnergy(creep, transfer_amount) ==
                  ERR_NOT_IN_RANGE) {
               creep.moveTo(withdraw.target);
            }
            return true;
         }
         return false;
      },
   };
};