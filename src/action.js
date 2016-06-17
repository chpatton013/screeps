'use strict';

module.exports = function() {
   var ACTION_BUILD = 'build';
   var ACTION_DEPOSIT = 'deposit';
   var ACTION_DROP = 'drop';
   var ACTION_HARVEST = 'harvest';
   var ACTION_IDLE = 'idle';
   var ACTION_PICKUP = 'pickup';
   var ACTION_RENEW = 'renew';
   var ACTION_REPAIR = 'repair';
   var ACTION_UPGRADE = 'upgrade';
   var ACTION_WITHDRAW = 'withdraw';

   var action_definitions = [
      {
         name: ACTION_BUILD,
         required_body_components: [WORK, CARRY, MOVE],
      },
      {
         name: ACTION_DEPOSIT,
         required_body_components: [WORK, CARRY, MOVE],
      },
      {
         name: ACTION_DROP,
         required_body_components: [CARRY],
      },
      {
         name: ACTION_HARVEST,
         required_body_components: [WORK, CARRY, MOVE],
      },
      {
         name: ACTION_IDLE,
         required_body_components: [MOVE],
      },
      {
         name: ACTION_PICKUP,
         required_body_components: [WORK, CARRY, MOVE],
      },
      {
         name: ACTION_RENEW,
         required_body_components: [MOVE],
      },
      {
         name: ACTION_REPAIR,
         required_body_components: [WORK, CARRY, MOVE],
      },
      {
         name: ACTION_UPGRADE,
         required_body_components: [WORK, CARRY, MOVE],
      },
      {
         name: ACTION_WITHDRAW,
         required_body_components: [WORK, CARRY, MOVE],
      },
   ];

   var actions = {};
   for (var index in action_definitions) {
      var action_definition = action_definitions[index];
      var name = action_definition.name;
      var required_body_components = action_definition.required_body_components;
      actions[name] = require('action.' + name)(name, required_body_components);
   }

   return {
      constants: {
         BUILD: ACTION_BUILD,
         DEPOSIT: ACTION_DEPOSIT,
         DROP: ACTION_DROP,
         HARVEST: ACTION_HARVEST,
         IDLE: ACTION_IDLE,
         PICKUP: ACTION_PICKUP,
         RENEW: ACTION_RENEW,
         REPAIR: ACTION_REPAIR,
         UPGRADE: ACTION_UPGRADE,
         WITHDRAW: ACTION_WITHDRAW,
      },
      actions: actions,
   };
}();
