'use strict';

function get_spawns_with_energy(room) {
   return room.find(FIND_STRUCTURES, {
      filter: function(structure) {
         return structure.structureType == STRUCTURE_SPAWN &&
            structure.energy > 0;
      },
   });
}

function get_extensions_with_energy(room) {
   return room.find(FIND_STRUCTURES, {
      filter: function(structure) {
         return structure.structureType == STRUCTURE_EXTENSION &&
            structure.energy > 0;
      },
   });
}

function get_spawns_with_surplus_energy(room) {
   var spawns = get_spawns_with_energy(room);
   var extensions = get_extensions_with_energy(room);

   var extension_energy = _.map(
         extensions,
         function(extension) { return extension.energy; });
   var total_extension_energy = _.reduce(
         extension_energy,
         function(accumulator, value) { return accumulator + value; },
         0);

   var WORKER_BODY_COST = 400;

   var targets = [];
   for (var index in spawns) {
      var spawn = spawns[index];
      var surplus = spawn.energy + total_extension_energy - WORKER_BODY_COST;
      if (surplus > 0) {
         targets.push({target: spawn, surplus: surplus});
      }
   }
   return targets;
}

function get_withdraw_targets(room) {
   var spawns = get_spawns_with_energy(room);
   var extensions = get_extensions_with_energy(room);

   var extension_energy = _.map(
         extensions,
         function(extension) { return extension.energy; });
   var total_extension_energy = _.reduce(
         extension_energy,
         function(accumulator, value) { return accumulator + value; },
         0);

   var targets = [];

   targets.concat(spawns);

   var surplus_minimum = _.min(_.map(
            targets,
            function(target) { return target.surplus; },
            Number.MAX_SAFE_INTEGER));

   for (var index in extensions) {
      var extension = extensions[index];
      var surplus = Math.min(extension.energy, surplus_minimum);
      targets.push({target: extension, surplus: surplus});
   }

   return targets;
}

module.exports = {
   get_spawns_with_energy: get_spawns_with_energy,
   get_extensions_with_energy: get_extensions_with_energy,
   get_spawns_with_surplus_energy: get_spawns_with_surplus_energy,
   get_withdraw_targets: get_withdraw_targets,
};
