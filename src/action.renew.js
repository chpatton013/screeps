'use strict';

module.exports = function(name, required_body_components) {
   var renew_structure_types = [
      STRUCTURE_SPAWN,
   ];

   return {
      renew_structure_types: renew_structure_types,
      get_renew_targets: utilities.get_spawns_with_surplus_energy,
      run: function(creep) {
         var renew_targets = utilities.get_spawns_with_surplus_energy(creep.room);
         if (renew_targets.length > 0) {
            // TODO: Prioritize targets by contention and distance to creep.
            var target = renew_targets[0];
            if (target.renewCreep(creep) == ERR_NOT_IN_RANGE) {
               creep.moveTo(target);
            }
            return true;
         }
         return false;
      },
   };
};
