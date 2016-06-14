'use strict';

module.exports.loop = function () {
   var ROLE_BUILDER = 'builder';
   var ROLE_HARVESTER = 'harvester';
   var ROLE_UPGRADER = 'upgrader';

   var role_definitions = [
      {
         name: ROLE_BUILDER,
         quota: 2,
         body_components: {
            WORK: 1,
            CARRY: 2,
            MOVE: 2,
         },
      },
      {
         name: ROLE_HARVESTER,
         quota: 4,
         body_components: {
            WORK: 1,
            CARRY: 2,
            MOVE: 2,
         },
      },
      {
         name: ROLE_UPGRADER,
         quota: 4,
         body_components: {
            WORK: 1,
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

   // Cleanup memory from dead creeps.
   for (var name in Memory.creeps) {
      if (!Game.creeps[name]) {
         delete Memory.creeps[name];
      }
   }

   // Create new creeps if we can and need to.
   var spawn = Game.spawns.Spawn1;
   if (!spawn.spawning) {
      for (var name in roles) {
         var role = roles[name];
         var creeps = _.filter(
            Game.creeps,
            function(creep) { return creep.memory.role == name; });
         var quota = role.quota;
         if (creeps.length < quota) {
            var body = role.get_body_definition();
            if (spawn.canCreateCreep(body) == OK) {
               spawn.createCreep(body, undefined, {role: name});
               break;
            }
         }
      }
   }

   // Tell all the creeps what to do.
   for (var name in Game.creeps) {
      var creep = Game.creeps[name];
      roles[creep.memory.role].run(creep);
   }
}
