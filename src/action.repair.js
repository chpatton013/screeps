'use strict';

var utilities = require('utilities');

module.exports = function(name, required_body_components) {
   if (!Memory.repairs) {
      Memory.repairs = {};
   }

   var ignore_structure_types = [
      STRUCTURE_WALL,
   ];

   var REPAIR_HITS_RATIO_HYSTERESIS_LOW = 0.25;
   var REPAIR_HITS_RATIO_HYSTERESIS_HIGH = 0.75;

   function get_repair_targets(room) {
      return room.find(FIND_STRUCTURES, {
         filter: function(structure) {
            if (_.contains(ignore_structure_types, structure.structureType)) {
               return false;
            }

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

            var repair_start = Memory.repairs[structure.id];
            return repair_start && (repair_start < structure.hits);
         },
      });
   }

   return {
      name: name,
      required_body_components: required_body_components,
      get_repair_targets: get_repair_targets,
      run: function(creep) {
         var repair_targets = get_repair_targets(creep.room);
         if (repair_targets.length) {
            var target = utilities.sort_by_distance(
                  repair_targets,
                  creep.pos)[0];
            var repair_result = creep.repair(target);
            if (repair_result == OK) {
               Memory.repairs[target.id] = target.hits;
            } else if (repair_result == ERR_NOT_IN_RANGE) {
               creep.moveTo(target);
            } else {
               console.log('Failed to repair:', repair_result);
               return false;
            }
            return true;
         }
         return false;
      },
   };
};
