'use strict';

module.exports = function() {
   var ROLE_BUILDER = 'builder';
   var ROLE_HARVESTER = 'harvester';
   var ROLE_UPGRADER = 'upgrader';
   var ROLE_CLAIMER = 'claimer';
   var ROLE_MELEE_SOLDIER = 'melee_soldier';

   var role_definitions = [
      {
         name: ROLE_BUILDER,
         quota: 1,
         body_components: {
            WORK: 3,
            CARRY: 3,
            MOVE: 3,
         },
      },
      {
         name: ROLE_HARVESTER,
         quota: 4,
         body_components: {
            WORK: 3,
            CARRY: 3,
            MOVE: 3,
         },
      },
      {
         name: ROLE_UPGRADER,
         quota: 4,
         body_components: {
            WORK: 3,
            CARRY: 3,
            MOVE: 3,
         },
      },
      {
         name: ROLE_CLAIMER,
         quota: 0,
         body_components: {
            MOVE: 1,
            CLAIM: 1,
         },
      },
      {
         name: ROLE_MELEE_SOLDIER,
         quota: 0,
         body_components: {
            MOVE: 1,
            ATTACK: 1,
         },
      },
   ];

   var roles = {};
   for (var index in role_definitions) {
      var role_definition = role_definitions[index];
      var name = role_definition.name;
      var quota = role_definition.quota;
      var body_components = role_definition.body_components;
      roles[name] = require('role.' + name)(name, quota, body_components);
   }

   return {
      constants: {
         BUILDER: ROLE_BUILDER,
         HARVESTER: ROLE_HARVESTER,
         UPGRADER: ROLE_UPGRADER,
         CLAIMER: ROLE_CLAIMER,
         MELEE_SOLDIER: ROLE_MELEE_SOLDIER,
      },
      roles: roles,
      run: function() {
         // Tell all the creeps what to do.
         for (var name in Game.creeps) {
            var creep = Game.creeps[name];
            var role = roles[creep.memory.role];
            if (role) {
               role.run(creep);
            } else {
               console.log('Creep ' + creep.name + ' has invalid role ' +
                     creep.memory.role);
            }
         }
      },
   };
}();
