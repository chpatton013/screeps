'use strict';

var ROLE_BUILDER = 'builder';
var ROLE_HARVESTER = 'harvester';
var ROLE_UPGRADER = 'upgrader';

module.exports.loop = function () {
   var role_names = [ROLE_BUILDER, ROLE_HARVESTER, ROLE_UPGRADER];
   var role_automation = {};
   role_automation[ROLE_BUILDER] = {
      quota: 2,
      components: _.flatten([
         new Array(1).fill(WORK),
         new Array(2).fill(CARRY),
         new Array(2).fill(MOVE),
      ], /* shallow */ true),
   };
   role_automation[ROLE_HARVESTER] = {
      quota: 4,
      components: _.flatten([
         new Array(1).fill(WORK),
         new Array(2).fill(CARRY),
         new Array(2).fill(MOVE),
      ], /* shallow */ true),
   };
   role_automation[ROLE_UPGRADER] = {
      quota: 2,
      components: _.flatten([
         new Array(1).fill(WORK),
         new Array(2).fill(CARRY),
         new Array(2).fill(MOVE),
      ], /* shallow */ true),
   };

   var roles = {};
   for (var index = 0; index < role_names.length; ++index) {
      var name = role_names[index];
      roles[name] = {
         name: name,
         behavior: require('role.' + name),
         quota: role_automation[name].quota,
         components: role_automation[name].components,
      };
   }

   for (var name in Memory.creeps) {
      if (!Game.creeps[name]) {
         delete Memory.creeps[name];
      }
   }

   for (var name in roles) {
      var role = roles[name];
      var creeps = _.filter(
         Game.creeps,
         (creep) => creep.memory.role == name);
      var quota = role.quota;
      if (creeps.length < quota) {
         Game.spawns.Spawn1.createCreep(
               role.components,
               undefined,
               {role: name});
      }
   }

   for (var name in Game.creeps) {
      var creep = Game.creeps[name];
      roles[creep.memory.role].behavior.run(creep);
   }
}
