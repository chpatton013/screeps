'use strict';

module.exports = function() {
   return function(target, resourceType, amount) {
      if (resourceType != RESOURCE_ENERGY) {
         return ERR_INVALID_ARGS;
      }
      return this.transferEnergy(target, amount);
   };
}();
