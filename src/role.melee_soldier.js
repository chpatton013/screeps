'use strict';

var Action = require('action');

module.exports = function(name, quota, body_components) {
   function get_memory() {
      return {
         role: name,
         invade_room: 'W17S7',
         target: undefined,
      };
   }

   return {
      name: name,
      quota: quota,
      body_components: body_components,
      get_memory: get_memory,
      run: function(creep) {
         // Melee soldier state transitions:
         // ENTER -> Travel -> Attack

         if (creep.room.name != creep.memory.invade_room.name) {
            var route = Game.map.findRoute(
                  creep.room,
                  creep.memory.invade_room);
            if (route.length > 0) {
               var exit = creep.pos.findClosestByRange(route[0].exit);
               creep.moveTo(exit);
               return;
            }
         }

         Action.actions[Action.constants.ATTACK].run(creep);
      },
   };
};
