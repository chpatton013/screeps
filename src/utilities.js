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

function get_towers_with_energy(room) {
   return room.find(FIND_STRUCTURES, {
      filter: function(structure) {
         return structure.structureType == STRUCTURE_TOWER &&
            structure.energy > 0;
      },
   });
}

function get_containers_with_energy(room) {
   return room.find(FIND_STRUCTURES, {
      filter: function(structure) {
         return structure.structureType == STRUCTURE_CONTAINER &&
            structure.energy > 0;
      },
   });
}

function get_storage_with_energy(room) {
   return room.find(FIND_STRUCTURES, {
      filter: function(structure) {
         return structure.structureType == STRUCTURE_STORAGE &&
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

function get_spawns_missing_energy(room) {
   return room.find(FIND_STRUCTURES, {
      filter: function(structure) {
         return structure.structureType == STRUCTURE_SPAWN &&
            structure.energy < structure.energyCapacity;
      },
   });
}

function get_extensions_missing_energy(room) {
   return room.find(FIND_STRUCTURES, {
      filter: function(structure) {
         return structure.structureType == STRUCTURE_EXTENSION &&
            structure.energy < structure.energyCapacity;
      },
   });
}

function get_towers_missing_energy(room) {
   return room.find(FIND_STRUCTURES, {
      filter: function(structure) {
         return structure.structureType == STRUCTURE_TOWER &&
            structure.energy < structure.energyCapacity;
      },
   });
}

function get_containers_missing_energy(room) {
   return room.find(FIND_STRUCTURES, {
      filter: function(structure) {
         return structure.structureType == STRUCTURE_CONTAINER &&
            structure.energy < structure.energyCapacity;
      },
   });
}

function get_storage_missing_energy(room) {
   return room.find(FIND_STRUCTURES, {
      filter: function(structure) {
         return structure.structureType == STRUCTURE_STORAGE &&
            structure.energy < structure.energyCapacity;
      },
   });
}

function get_withdraw_targets(room) {
   var spawns = get_spawns_with_energy(room);
   var extensions = get_extensions_with_energy(room);

   var total_extension_energy = _.sum(_.map(extensions, function(extension) {
      return extension.energy;
   }));

   var spawn_targets = [];
   for (var index in spawns) {
      var spawn = spawns[index];
      var surplus = spawn.energy + total_extension_energy - WORKER_BODY_COST;
      if (surplus > 0) {
         spawn_targets.push({target: spawn, surplus: surplus});
      }
   }

   var surplus_minimum = _.min(_.map(spawn_targets, function(target) {
      return target.surplus;
   }));
   var extension_targets = _.map(extensions, function(extension) {
      var surplus = Math.min(extension.energy, surplus_minimum);
      return {target: extension, surplus: surplus};
   });

   var storage_targets = [].concat(
      get_containers_with_energy(room),
      get_storage_with_energy(room));

   function annotate_with_surplus(target) {
      return {target: target, surplus: target.energy};
   }

   return _.filter([
      storage_targets,
      extension_targets,
      _.map(spawn_targets, annotate_with_surplus),
   ], function(subset) { return subset.length > 0; });
}

function get_deposit_targets(room) {
   function annotate_with_deficit(target) {
      return {target: target, deficit: target.energyCapacity - target.energy};
   }

   var spawn_targets = get_spawns_missing_energy(room);
   var extension_targets = get_extensions_missing_energy(room);
   var tower_targets = get_towers_missing_energy(room);
   var storage_targets = [].concat(
      get_containers_missing_energy(room),
      get_storage_missing_energy(room));

   return _.filter([
      _.map(spawn_targets, annotate_with_deficit),
      _.map(extension_targets, annotate_with_deficit),
      _.map(tower_targets, annotate_with_deficit),
      _.map(storage_targets, annotate_with_deficit),
   ], function(subset) { return subset.length > 0; });
}

module.exports = {
   sort_by_distance: sort_by_distance,

   get_spawns_with_energy: get_spawns_with_energy,
   get_extensions_with_energy: get_extensions_with_energy,
   get_towers_with_energy: get_towers_with_energy,
   get_containers_with_energy: get_containers_with_energy,
   get_storage_with_energy: get_storage_with_energy,
   get_spawns_with_surplus_energy: get_spawns_with_surplus_energy,

   get_spawns_missing_energy: get_spawns_missing_energy,
   get_extensions_missing_energy: get_extensions_missing_energy,
   get_towers_missing_energy: get_towers_missing_energy,
   get_containers_missing_energy: get_containers_missing_energy,
   get_storage_missing_energy: get_storage_missing_energy,

   get_withdraw_targets: get_withdraw_targets,
   get_deposit_targets: get_deposit_targets,
};
