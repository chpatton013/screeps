'use strict';

var utilities = require('utilities');

module.exports = function(name, required_body_components) {
   function get_source_targets(room) {
      return room.find(FIND_SOURCES);
   }

   return {
      name: name,
      required_body_components: required_body_components,
      get_source_targets: get_source_targets,
      run: function(creep) {
         var source_targets = get_source_targets(creep.room);
         var target = utilities.sort_by_distance(
               source_targets,
               creep.pos)[0];
         var harvest_result = creep.harvest(target);
         if (harvest_result == ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
         } else if (harvest_result != OK) {
            console.log('Failed to harvest:', harvest_result);
            return false;
         }
         return true;
      },
   };
};
