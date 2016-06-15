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
            if (creep.build(target) == ERR_NOT_IN_RANGE) {
               creep.moveTo(target);
            }
            return true;
         }
         return false;
      },
   };
};
