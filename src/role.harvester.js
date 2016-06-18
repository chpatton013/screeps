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

         // Harvester state transitions:
         // ENTER -> Renew -> Harvest -> Deposit -> Idle

         var MAX_TICKS_TO_LIVE = 1500;
         var MIN_RENEW_THRESHOLD = MAX_TICKS_TO_LIVE * 0.25;
         var MAX_RENEW_THRESHOLD = MAX_TICKS_TO_LIVE * 0.75;

         if (creep.memory.renewing &&
               creep.ticksToLive > MAX_RENEW_THRESHOLD) {
            creep.memory.renewing = false;
         } else if (!creep.memory.renewing &&
               creep.ticksToLive < MIN_RENEW_THRESHOLD) {
            creep.memory.renewing = true;
         }
         if (creep.memory.renewing &&
               Action.actions[Action.constants.RENEW].run(creep)) {
            return;
         }

         if (creep.memory.harvesting &&
               creep.carry.energy == creep.carryCapacity) {
            creep.memory.harvesting = false;
         } else if (!creep.memory.harvesting && creep.carry.energy == 0) {
            creep.memory.harvesting = true;
         }
         if (creep.memory.harvesting &&
               Action.actions[Action.constants.HARVEST].run(creep)) {
            return;
         }

         if (creep.memory.depositing && creep.carry.energy == 0) {
            creep.memory.depositing = false;
         } else if (!creep.memory.depositing &&
               creep.carry.energy == creep.carryCapacity) {
            creep.memory.depositing = true;
         }
         if (creep.memory.depositing &&
               Action.actions[Action.constants.DEPOSIT].run(creep)) {
            return;
         }

         Action.actions[Action.constants.IDLE].run(creep);
      },
   };
};
