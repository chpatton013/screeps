'use strict';

module.exports = function() {
   return {
      run: function() {
         // Cleanup memory from dead creeps.
         for (var name in Memory.creeps) {
            if (!Game.creeps[name]) {
               delete Memory.creeps[name];
            }
         }

         // Cleanup memory from dead structures.
         for (var name in Memory.repairs) {
            var structure = Game.getObjectById(name);
            if (!structure) {
               delete Memory.repairs[name];
            }
         }
      },
   };
}();
