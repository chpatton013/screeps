'use strict';

var Action = require('action');

module.exports = function(name, quota, body_components) {
   return {
      name: name,
      quota: quota,
      body_components: body_components,
      run: function(creep) {
         // Builder state transitions:
         // ENTER -> Renew -> Repair -> Build -> Withdraw -> Idle

         var RENEW_THRESHOLD = 200;

         if (creep.memory.renewing && creep.ticks == creep.ticksMax) {
            creep.memory.renewing = false;
         } else if (!creep.memory.renewing && creep.ticks < RENEW_THRESHOLD) {
            creep.memory.renewing = true;
         }
         if (creep.memory.renewing &&
               Action.actions[Action.constants.RENEW].run(creep)) {
            return;
         }

         if (creep.memory.repairing && creep.carry.energy == 0) {
            creep.memory.repairing = false;
         } else if (!creep.memory.repairing && creep.carry.energy > 0) {
            creep.memory.repairing = true;
         }
         if (creep.memory.repairing &&
               Action.actions[Action.constants.REPAIR].run(creep)) {
            return;
         }

         if (creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
         } else if (!creep.memory.building && creep.carry.energy > 0) {
            creep.memory.building = true;
         }
         if (creep.memory.building &&
               Action.actions[Action.constants.BUILD].run(creep)) {
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
