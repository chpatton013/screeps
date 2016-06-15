'use strict';

module.exports = function(name, required_body_components) {
   function get_repair_targets(room) {
      return room.find(FIND_STRUCTURES, {
         filter: function(structure) {
            return structure.hits < structure.hitsMax;
         },
      });
   }

   return {
      name: name,
      required_body_components: required_body_components,
      get_repair_targets: get_repair_targets,
      run: function(creep) {
         var repair_targets = get_repair_targets(creep.room);
         if (repair_targets.length) {
            // TODO: Prioritize targets by distance to creep.
            var target = repair_targets[0];
            if (creep.repair(target) == ERR_NOT_IN_RANGE) {
               creep.moveTo(target);
            }
            return true;
         }
         return false;
      },
   };
};
