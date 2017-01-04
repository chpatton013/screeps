"use strict";

module.exports = function() {
   function create(body, memory) {
      if (this.spawning) {
         return ERR_BUSY;
      } else if (!this.canCreateCreep(body)) {
         return ERR_NOT_ENOUGH_RESOURCES;
      } else {
         return this.createCreep(body, undefined, memory);
      }
   }

   return {
      create: create,
      transfer: require("./storage_interface"),
   };
}();
