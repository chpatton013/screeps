'use strict';

module.exports = function(name, required_body_components) {
   function get_sources(room) {
      return room.find(FIND_SOURCES);
   }

   return {
      name: name,
      required_body_components: required_body_components,
      get_sources: get_sources,
      run: function(creep) {
         var sources = get_sources(creep.room);
         // TODO: Prioritize sources by distance to creep.
         if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(sources[0]);
            return true;
         }
         return false;
      },
   };
};
