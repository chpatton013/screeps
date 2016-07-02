'use strict';

var utilities = require('utilities');

module.exports = function(name, required_body_components) {
   return {
      name: name,
      required_body_components: required_body_components,
      run: function(creep) {
         var repair_targets = utilities.get_repair_targets(creep.room);
         if (repair_targets.length) {
            var target = utilities.sort_by_distance(
                  repair_targets,
                  creep.pos)[0];
            var repair_result = creep.repair(target);
            if (repair_result == OK) {
               Memory.repairs[target.id] = target.hits;
            } else if (repair_result == ERR_NOT_IN_RANGE) {
               creep.moveTo(target);
            } else {
               console.log('Failed to repair:', repair_result);
               return false;
            }
            return true;
         }
         return false;
      },
   };
};
