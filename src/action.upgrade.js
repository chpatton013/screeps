'use strict';

module.exports = function(name, required_body_components) {
   return {
      run: function(creep) {
         if (creep.upgradeController(creep.room.controller) ==
               ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller);
         }
         return true;
      },
   };
};
