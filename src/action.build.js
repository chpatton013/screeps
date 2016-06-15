'use strict';

module.exports = function(name, required_body_components) {
   function get_build_targets(room) {
      return room.find(FIND_CONSTRUCTION_SITES);
   }

   return {
      name: name,
      required_body_components: required_body_components,
      get_build_targets: get_build_targets,
      run: function(creep) {
         var build_targets = get_build_targets(creep.room);
         if (build_targets.length) {
            // TODO: Prioritize targets by distance to creep.
            var target = build_targets[0];
            var build_result = creep.build(target);
            if (build_result == ERR_NOT_IN_RANGE) {
               creep.moveTo(target);
            } else if (build_result != OK) {
               console.log('Failed to build:', build_result);
               return false;
            }
            return true;
         }
         return false;
      },
   };
};
