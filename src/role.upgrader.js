'use strict';

var Action = require('action');

module.exports = function(name, quota, body_components) {
   return {
      name: name,
      quota: quota,
      body_components: body_components,
      run: function(creep) {
         // Upgrader state transitions:
         // ENTER -> Renew -> Upgrade -> Withdraw -> Idle

         var RENEW_THRESHOLD = 200;
         var MAX_TICKS_TO_LIVE = 1500;

         if (creep.memory.renewing && creep.ticksToLive == MAX_TICKS_TO_LIVE) {
            creep.memory.renewing = false;
         } else if (!creep.memory.renewing &&
               creep.ticksToLive < RENEW_THRESHOLD) {
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
      }
   };
};
