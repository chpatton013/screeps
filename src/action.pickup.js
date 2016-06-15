'use strict';

module.exports = function(name, required_body_components) {
   function get_pickup_targets(room) {
      return room.find(FIND_DROPPED_RESOURCES);
   }

   return {
      name: name,
      required_body_components: required_body_components,
      get_pickup_targets: get_pickup_targets,
      run: function(creep) {
         var pickup_targets = get_pickup_targets(creep.room);
         if (pickup_targets.length) {
            // TODO: Prioritize targets by distance to creep.
            var target = pickup_targets[0];
            if (creep.pickup(target) == ERR_NOT_IN_RANGE) {
               creep.moveTo(target);
               return true;
            }
         }
         return false;
      },
   };
};
