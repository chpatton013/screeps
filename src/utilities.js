'use strict';

var WORKER_BODY_COST = 400;

function sort_by_distance(targets, position, get_target) {
   if (!get_target) {
      get_target = function(x) { return x; };
   }

   var square_distances = {};
   for (var index in targets) {
      var target = get_target(targets[index]);
      var dx = position.x - target.pos.x;
      var dy = position.y - target.pos.y;
      square_distances[target.id] = dx * dx + dy * dy;
   }

   var sorted_targets = targets.slice(0);
   sorted_targets.sort(function(a, b) {
      return square_distances[a.id] - square_distances[b.id];
   });
   return sorted_targets;
}

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

   var total_extension_energy = _.sum(_.map(extensions, function(extension) {
      return extension.energy;
   }));

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

   var total_extension_energy = _.sum(_.map(extensions, function(extension) {
      return extension.energy;
   }));

   var targets = [];
   for (var index in spawns) {
      var spawn = spawns[index];
      var surplus = spawn.energy + total_extension_energy - WORKER_BODY_COST;
      if (surplus > 0) {
         targets.push({target: spawn, surplus: surplus});
      }
   }

   if (targets.length == 0) {
      return [];
   }

   var surplus_minimum = _.min(_.map(targets, function(target) {
      return target.surplus;
   }));

   targets.concat(_.map(extensions, function(extension) {
      var surplus = Math.min(extension.energy, surplus_minimum);
      return {target: extension, surplus: surplus};
   });

   return targets;
}

module.exports = {
   sort_by_distance: sort_by_distance,
   get_spawns_with_energy: get_spawns_with_energy,
   get_extensions_with_energy: get_extensions_with_energy,
   get_spawns_with_surplus_energy: get_spawns_with_surplus_energy,
   get_withdraw_targets: get_withdraw_targets,
};
