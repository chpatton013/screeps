'use strict';

var Role = require('role');

module.exports = function() {
   var body_component_name_to_value = {
      MOVE: MOVE,
      WORK: WORK,
      CARRY: CARRY,
      ATTACK: ATTACK,
      RANGED_ATTACK: RANGED_ATTACK,
      HEAL: HEAL,
      CLAIM: CLAIM,
      TOUGH: TOUGH,
   };

   // Index creeps to help decide if we need to spawn them.
   function get_creeps_by_room_and_role() {
      var creeps_by_room_and_role = {};

      // Setup the empty from for the index.
      for (var room_name in Game.rooms) {
         creeps_by_room_and_role[room_name] = {};
         for (var role_name in Role.roles) {
            creeps_by_room_and_role[room_name][role_name] = []
         }
      }

      // Populate the index with our living creeps.
      for (var creep_name in Game.creeps) {
         var creep = Game.creeps[creep_name];
         var room_name = creep.room.name;
         var role_name = creep.memory.role;
         creeps_by_room_and_role[room_name][role_name].push(creep);
      }

      return creeps_by_room_and_role;
   }

   return {
      body_component_name_to_value: body_component_name_to_value,
      get_creeps_by_room_and_role: get_creeps_by_room_and_role,
      run: function() {
         // Spawn creeps from every available spawner until our room populations
         // are all up to quota for each role.
         var spawned = [];
         var creeps_by_room_and_role = get_creeps_by_room_and_role();
         for (var spawn_name in Game.spawns) {
            var spawn = Game.spawns[spawn_name];
            var room = spawn.room;
            if (!spawn.spawning) {
               for (var role_name in Role.roles) {
                  var role = Role.roles[role_name];
                  var quota = role.quota;
                  var index_entry =
                     creeps_by_room_and_role[room.name][role_name];
                  if (index_entry.length < quota) {
                     var body = [];
                     for (var component_name in role.body_components) {
                        var amount = role.body_components[component_name];
                        var component =
                           body_component_name_to_value[component_name];
                        body.concat(new Array(amount).fill(component));
                     }
                     if (spawn.canCreateCreep(body) == OK) {
                        if (spawn.createCreep(
                                 body,
                                 undefined,
                                 {role: name}) == OK) {
                           var creep = Game.creeps[spawn.spawning];
                           index_entry.push(creep);
                           spawned.push(creep);
                           break;
                        }
                     }
                  }
               }
            }
         }
         return spawned;
      },
   };
}();
