'use strict';

var Role = require('role');

module.exports.loop = function () {
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

   // Cleanup memory from dead creeps.
   for (var name in Memory.creeps) {
      if (!Game.creeps[name]) {
         delete Memory.creeps[name];
      }
   }

   // Create new creeps if we can and need to.
   var spawn = Game.spawns.Spawn1;
   if (!spawn.spawning) {
      for (var name in Role.roles) {
         var role = Role.roles[name];
         var creeps = _.filter(
            Game.creeps,
            function(creep) { return creep.memory.role == name; });
         var quota = role.quota;
         if (creeps.length < quota) {
            var body = [];
            for (var component_name in body_components) {
               var amount = role.body_components[component_name];
               var component = body_component_name_to_value[component_name];
               body = body.concat(new Array(amount).fill(component));
            }
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
      var role = Role.roles[creep.memory.role];
      if (role) {
         role.run(creep);
      } else {
         console.log('Creep ' + creep.name + ' has invalid role ' + creep.memory.role);
      }
   }
}
