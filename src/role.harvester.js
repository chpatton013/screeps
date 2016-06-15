'use strict';

var Action = require('action');

module.exports = function(name, quota, body_components) {
   return {
      name: name,
      quota: quota,
      body_components: body_components,
      run: function(creep) {
         // memory: Harvesting defined as the return trip to the deposit structure.
         if (creep.memory.harvesting && creep.carry.energy == 0) {
            creep.memory.harvesting = false;
         }
         if (!creep.memory.harvesting && creep.carry.energy == creep.carryCapacity) {
            creep.memory.harvesting = true;
         }

         if (creep.memory.harvesting) {
            Action.actions[Action.constants.DEPOSIT].run(creep);
         } else {
            Action.actions[Action.constants.HARVEST].run(creep);
         }
      }
   };
};
