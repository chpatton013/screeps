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

         // Upgrader state transitions:
         // ENTER -> Renew -> Upgrade -> Pickup -> Withdraw -> Idle

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

         if (creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
         } else if (!creep.memory.upgrading &&
               creep.carry.energy == creep.carryCapacity) {
            creep.memory.upgrading = true;
         }
         if (creep.memory.upgrading &&
               Action.actions[Action.constants.UPGRADE].run(creep)) {
            return;
         }

         if (creep.memory.pickingup &&
               creep.carry.energy == creep.carryCapacity) {
            creep.memory.pickingup = false;
         } else if (!creep.memory.pickingup && creep.carry.energy == 0) {
            creep.memory.pickingup = true;
         }
         if (creep.memory.pickingup &&
               Action.actions[Action.constants.PICKUP].run(creep)) {
            return;
         }

         if (creep.memory.withdrawing &&
               creep.carry.energy == creep.carryCapacity) {
            creep.memory.withdrawing = false;
         } else if (!creep.memory.withdrawing && creep.carry.energy == 0) {
            creep.memory.withdrawing = true;
         }
         if (creep.memory.withdrawing &&
               Action.actions[Action.constants.WITHDRAW].run(creep)) {
            return;
         }

         Action.actions[Action.constants.IDLE].run(creep);
      },
   };
};
