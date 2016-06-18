'use strict';

var Action = require('action');

module.exports = function(name, quota, body_components) {
   function get_memory() {
      return {
         role: name,
         claim_room: 'W17S7',
         target: undefined,
      };
   }

   return {
      name: name,
      quota: quota,
      body_components: body_components,
      get_memory: get_memory,
      run: function(creep) {
         return;
         function claim(target) {
            if (!target.my) {
               var attack_result = creep.attackController(target);
               if (attack_result == ERR_NOT_IN_RANGE) {
                  creep.moveTo(target);
               } else if (attack_result != OK) {
                  console.log('Failed to attack controller:', attack_result);
                  return false;
               }
            } else {
               var claim_result = creep.claimController(target);
               if (claim_result == ERR_NOT_IN_RANGE) {
                  creep.moveTo(target);
               } else if (claim_result != OK) {
                  console.log('Failed to claim controller:', claim_result);
                  return false;
               }
            }
            return true;
         }

         if (creep.room.name != creep.memory.claim_room.name) {
            var route = Game.map.findRoute(
                  creep.room,
                  creep.memory.claim_room);
            if (route.length > 0) {
               var exit = creep.pos.findClosestByRange(route[0].exit);
               creep.moveTo(exit);
               return;
            }
         }

         var explicit_target = creep.memory.target;
         if (explicit_target && claim(explicit_target)) {
            return;
         }

         var claim_target = creep.room.controller;
         if (claim_target && claim(claim_target)) {
            return;
         }
      },
   };
};
