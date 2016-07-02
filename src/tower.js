'use strict';

var utilities = require('utilities');

var TOWER_ACTION_COST = 10;
var TOWER_RESERVE_RATIO = 0.5;

function hostile(tower) {
   var targets = utilities.get_hostile_targets(tower.room);

   if (targets.length > 0) {
      var target = utilities.sort_by_distance(targets[0], tower)[0];
      if (tower.attack(target) == OK) {
         return true;
      }
   }
   return false;
}

function friendly(tower) {
   if (tower.energy < tower.energyCapacity * TOWER_RESERVE_RATIO) {
      return false;
   }

   var targets = _.filter(
         utilities.get_friendly_targets(tower.room),
         function(target) { return !target.structureType; });

   if (targets.length > 0) {
      var target = targets[0];
      if (tower.heal(target) == OK) {
         return true;
      }
   }

   targets = utilities.get_repair_targets(tower.room);
   if (targets.length > 0) {
      var target = targets[0];
      if (tower.repair(target) == OK) {
         Memory.repairs[target.id] = target.hits;
         return true;
      }
   }

   return false;
}

module.exports = function() {
   return {
      run: function() {
         for (var room_name in Game.rooms) {
            var room = Game.rooms[room_name];
            var towers = room.find(FIND_STRUCTURES, {
               filter: function(structure) {
                  return structure.structureType == STRUCTURE_TOWER &&
                     (structure.energy >= TOWER_ACTION_COST);
               },
            });

            for (var index in towers) {
               var tower = towers[index];
               hostile(tower) || friendly(tower);
            }
         }
      },
   }
}();
