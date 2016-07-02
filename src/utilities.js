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

function sort_by_hits(targets, get_target) {
   if (!get_target) {
      get_target = function(x) { return x; };
   }

   var sorted_targets = targets.slice(0);
   sorted_targets.sort(function(a, b) {
      return a.hits < b.hits;
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
            structure.store < structure.storeCapacity;
      },
   });
}

function get_storage_missing_energy(room) {
   return room.find(FIND_STRUCTURES, {
      filter: function(structure) {
         return structure.structureType == STRUCTURE_STORAGE &&
            structure.store < structure.storeCapacity;
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

   var container_targets = get_containers_with_energy(room);
   var storage_targets = get_storage_with_energy(room);

   return _.filter([
      storage_targets,
      container_targets,
      extension_targets,
      spawn_targets,
   ], function(subset) { return subset.length > 0; });
}

function get_deposit_targets(room) {
   function annotate_with_deficit(target) {
      var deficit;
      if (target.structureType == STRUCTURE_CONTAINER ||
          target.structureType == STRUCTURE_STORAGE) {
         deficit = target.storeCapacity - target.store;
      } else {
         deficit = target.energyCapacity - target.energy;
      }
      return {target: target, deficit: deficit};
   }

   var spawn_targets = get_spawns_missing_energy(room);
   var extension_targets = get_extensions_missing_energy(room);
   var tower_targets = get_towers_missing_energy(room);
   var storage_targets = get_storage_missing_energy(room);
   var container_targets = get_containers_missing_energy(room);

   return _.filter([
      _.map(spawn_targets, annotate_with_deficit),
      _.map(extension_targets, annotate_with_deficit),
      _.map(tower_targets, annotate_with_deficit),
      _.map(storage_targets, annotate_with_deficit),
      _.map(container_targets, annotate_with_deficit),
   ], function(subset) { return subset.length > 0; });
}

function get_repair_targets(room) {
   if (!Memory.repairs) {
      Memory.repairs = {};
   }

   var REPAIR_HITS_RATIO_HYSTERESIS_LOW = 0.5;
   var REPAIR_HITS_RATIO_HYSTERESIS_HIGH = 0.75;

   var WALL_REPAIR_HITS_HYSTERESIS_LOW = 10 * 1000;
   var WALL_REPAIR_HITS_HYSTERESIS_HIGH = 100 * 1000;

   return room.find(FIND_STRUCTURES, {
      filter: function(structure) {
         if (structure.structureType == STRUCTURE_WALL) {
            if (structure.hits < WALL_REPAIR_HITS_HYSTERESIS_LOW) {
               return true;
            }

            if (structure.hits > WALL_REPAIR_HITS_HYSTERESIS_HIGH) {
               return false;
            }
         } else {
            var hysteresis_low_value =
               structure.hitsMax * REPAIR_HITS_RATIO_HYSTERESIS_LOW;
            if (structure.hits < hysteresis_low_value) {
               return true;
            }

            var hysteresis_high_value =
               structure.hitsMax * REPAIR_HITS_RATIO_HYSTERESIS_HIGH;
            if (structure.hits > hysteresis_high_value) {
               return false;
            }
         }

         var repair_start = Memory.repairs[structure.id];
         return repair_start && (repair_start < structure.hits);
      },
   });
}

function get_friendly_targets(room) {
   var filter = function(target) {
      return target.hits < target.hitsMax;
   };

   var spawn_targets = room.find(FIND_MY_SPAWNS, {filter: filter});
   var creep_targets = room.find(FIND_MY_CREEPS, {filter: filter});
   var structure_targets = room.find(FIND_MY_STRUCTURES, {
      filter: function(structure) {
         return structure.structureType != STRUCTURE_SPAWN && filter(structure);
      },
   });
   var construction_targets = room.find(FIND_MY_CONSTRUCTION_SITES, {
      filter: filter,
   });

   return _.filter([
      spawn_targets,
      creep_targets,
      structure_targets,
      construction_targets,
   ], function(subset) { return subset.length > 0; });
}

function get_hostile_targets(room) {
   var spawn_targets = room.find(FIND_HOSTILE_SPAWNS);
   var creep_targets = room.find(FIND_HOSTILE_CREEPS);
   var structure_targets = room.find(FIND_HOSTILE_STRUCTURES, {
      filter: function(structure) {
         return structure.structureType != STRUCTURE_SPAWN &&
            structure.structureType != STRUCTURE_CONTROLLER;
      },
   });
   var construction_targets = room.find(FIND_HOSTILE_CONSTRUCTION_SITES);

   return _.filter([
      spawn_targets,
      creep_targets,
      structure_targets,
      construction_targets,
   ], function(subset) { return subset.length > 0; });
}

module.exports = {
   sort_by_distance: sort_by_distance,
   sort_by_hits: sort_by_hits,

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
   get_repair_targets: get_repair_targets,
   get_friendly_targets: get_friendly_targets,
   get_hostile_targets: get_hostile_targets,
};
