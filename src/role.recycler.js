'use strict';

var Action = require('action');

module.exports = function(name, quota, body_components) {
   function get_memory() {
      return {role: name};
   }

   return {
      name: name,
      quota: quota,
      body_components: body_components,
      get_memory: get_memory,
      run: function(creep) {
         if (creep.ticksToLive == 1 &&
               Action.actions[Action.constants.DROP].run(creep)) {
            return;
         }

         // Builder state transitions:
         // ENTER -> Recycle -> Idle

         Action.actions[Action.constants.RECYCLE].run(creep) ||
            Action.actions[Action.constants.IDLE].run(creep);
      },
   };
};
