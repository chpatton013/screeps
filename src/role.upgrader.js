'use strict';

var Action = require('action');

module.exports = function(name, quota, body_components) {
   return {
      name: name,
      quota: quota,
      body_components: body_components,
      run: function(creep) {
         // memory: Upgrading defined as the return trip to the upgrade site.
         if (creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
         }
         if (!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
            creep.memory.upgrading = true;
         }

         if (creep.memory.upgrading) {
            Action.actions[Action.constants.UPGRADE].run(creep);
         } else {
            Action.actions[Action.constants.WITHDRAW].run(creep);
         }
      }
   };
};
