'use strict';

var utilities = require('utilities');

module.exports = function(name, required_body_components) {
   function get_recycle_targets(room) {
      return room.find(FIND_STRUCTURES, {
         filter: function(structure) {
            return structure.structureType == STRUCTURE_SPAWN;
         },
      });
   }

   return {
      name: name,
      required_body_components: required_body_components,
      get_recycle_targets: get_recycle_targets,
      run: function(creep) {
         var recycle_targets = get_recycle_targets(creep.room);
         if (recycle_targets.length) {
            var target = utilities.sort_by_distance(
                  recycle_targets,
                  creep.pos)[0];
            var recycle_result = target.recycleCreep(creep);
            if (recycle_result == ERR_NOT_IN_RANGE) {
               creep.moveTo(target);
            } else if (recycle_result != OK) {
               console.log('Failed to recycle:', recycle_result);
               return false;
            }
            return true;
         }
         return false;
      },
   };
};
