'use strict';

module.exports = function() {
   var ROLE_BUILDER = 'builder';
   var ROLE_HARVESTER = 'harvester';
   var ROLE_UPGRADER = 'upgrader';

   var role_definitions = [
      {
         name: ROLE_BUILDER,
         quota: 2,
         body_components: {
            WORK: 2,
            CARRY: 2,
            MOVE: 2,
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
         quota: 2,
         body_components: {
            WORK: 2,
            CARRY: 2,
            MOVE: 2,
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
