'use strict';

var utilities = require('utilities');

module.exports = function(name, required_body_components) {
   function get_high_priority_build_targets(room) {
      return room.find(FIND_CONSTRUCTION_SITES, {
         filter: function(target) {
            return target.structureType != STRUCTURE_ROAD;
         },
      });
   }

   function get_low_priority_build_targets(room) {
      return room.find(FIND_CONSTRUCTION_SITES, {
         filter: function(target) {
            return target.structureType == STRUCTURE_ROAD;
         },
      });
   }

   return {
      name: name,
      required_body_components: required_body_components,
      run: function(creep) {
         var build_targets = get_high_priority_build_targets(creep.room);
         if (build_targets.length == 0) {
            build_targets = get_low_priority_build_targets(creep.room);
         }

         if (build_targets.length > 0) {
            var target = utilities.sort_by_distance(
                  build_targets,
                  creep.pos)[0];
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
