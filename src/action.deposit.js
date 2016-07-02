'use strict';

var utilities = require('utilities');

module.exports = function(name, required_body_components) {
   var deposit_structure_types = [
      STRUCTURE_EXTENSION,
      STRUCTURE_SPAWN,
      STRUCTURE_CONTAINER,
      STRUCTURE_TOWER,
      STRUCTURE_STORAGE,
   ];

   return {
      name: name,
      required_body_components: required_body_components,
      deposit_structure_types: deposit_structure_types,
      get_deposit_targets: utilities.get_deposit_targets,
      run: function(creep) {
         var deposit_targets = utilities.get_deposit_targets(creep.room);
         if (deposit_targets.length > 0) {
            var deposit = utilities.sort_by_distance(
                  deposit_targets[0],
                  creep.pos,
                  function(deposit) { return deposit.target; })[0];
            var amount = Math.min(creep.carry.energy, deposit.deficit);
            var deposit_result = creep.transfer(
                  deposit.target,
                  RESOURCE_ENERGY,
                  amount);
            if (deposit_result == ERR_NOT_IN_RANGE) {
               creep.moveTo(deposit.target);
            } else if (deposit_result != OK) {
               console.log('Failed to deposit:', deposit_result);
               return false;
            }
            return true;
         }
         return false;
      },
   };
};
