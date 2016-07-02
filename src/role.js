'use strict';

module.exports = function() {
   var ROLE_BUILDER = 'builder';
   var ROLE_HARVESTER = 'harvester';
   var ROLE_UPGRADER = 'upgrader';
   var ROLE_RECYCLER = 'recycler';
   var ROLE_CLAIMER = 'claimer';
   var ROLE_MELEE_SOLDIER = 'melee_soldier';

   var priority_order = [
      ROLE_HARVESTER,
      ROLE_BUILDER,
      ROLE_UPGRADER,
      ROLE_RECYCLER,
      ROLE_CLAIMER,
      ROLE_MELEE_SOLDIER,
   ];

   var role_definitions = [
      {
         name: ROLE_BUILDER,
         quota: 1,
         body_components: {
            WORK: 1,
            CARRY: 1,
            MOVE: 1,
         },
      },
      {
         name: ROLE_HARVESTER,
         quota: 4,
         body_components: {
            WORK: 2,
            CARRY: 2,
            MOVE: 2,
         },
      },
      {
         name: ROLE_UPGRADER,
         quota: 1,
         body_components: {
            WORK: 1,
            CARRY: 1,
            MOVE: 1,
         },
      },
      {
         name: ROLE_RECYCLER,
         quota: 0,
         body_components: {
            MOVE: 1,
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
         RECYCLER: ROLE_RECYCLER,
         CLAIMER: ROLE_CLAIMER,
         MELEE_SOLDIER: ROLE_MELEE_SOLDIER,
      },
      roles: roles,
      priority_order: priority_order,
      run: function() {
         // Tell all the creeps what to do.
         for (var name in Game.creeps) {
            var creep = Game.creeps[name];
            if (creep.spawning) {
               continue;
            }

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
