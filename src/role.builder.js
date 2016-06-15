'use strict';

var Action = require('action');

module.exports = function(name, quota, body_components) {
   return {
      name: name,
      quota: quota,
      body_components: body_components,
      run: function(creep) {
         // memory: Building defined as the return trip to the construction site.
         if (creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
         }
         if (!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
         }

         if (creep.memory.building) {
            Action.actions[Action.constants.BUILD].run(creep);
         } else {
            Action.actions[Action.constants.WITHDRAW].run(creep);
         }
      }
   };
};
