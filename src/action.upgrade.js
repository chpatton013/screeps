'use strict';

module.exports = function(name, required_body_components) {
   return {
      run: function(creep) {
         var upgrade_result = creep.upgradeController(creep.room.controller);
         if (upgrade_result == ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller);
         } else if (upgrade_result != OK) {
            console.log('Failed to upgrade:', upgrade_result);
            return false;
         }
         return true;
      },
   };
};
