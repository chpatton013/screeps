"use strict";

module.exports = function() {
   // Remove entries from dead creeps.
   for (var name in Memory.creeps) {
      if (!Game.creeps[name]) {
         delete Memory.creeps[name];
      }
   }

   // Remove entries from dead structures.
   for (var name in Memory.repairs) {
      var structure = Game.getObjectById(name);
      if (!structure) {
         delete Memory.repairs[name];
      }
   }
};
