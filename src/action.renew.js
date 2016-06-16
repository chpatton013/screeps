'use strict';

var utilities = require('utilities');

module.exports = function(name, required_body_components) {
   var renew_structure_types = [
      STRUCTURE_SPAWN,
   ];

   return {
      renew_structure_types: renew_structure_types,
      get_renew_targets: utilities.get_spawns_with_surplus_energy,
      run: function(creep) {
         var renew_targets =
            utilities.get_spawns_with_surplus_energy(creep.room);
         if (renew_targets.length > 0) {
            var renew = utilities.sort_by_distance(
                  renew_targets,
                  creep.pos,
                  function(renew) { return renew.target; })[0];
            var renew_result = renew.target.renewCreep(creep);
            if (renew_result == ERR_NOT_IN_RANGE) {
               creep.moveTo(renew.target);
            } else if (renew_result != OK) {
               console.log('Failed to renew:', renew_result);
               return false;
            }
            return true;
         }
         return false;
      },
   };
};
