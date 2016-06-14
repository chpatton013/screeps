'use strict';

module.exports = {
   run: function(creep) {
      // memory: Harvesting defined as the return trip to the deposit structure.
      if (creep.memory.harvesting && creep.carry.energy == 0) {
         creep.memory.harvesting = false;
      }
      if (!creep.memory.harvesting && creep.carry.energy == creep.carryCapacity) {
         creep.memory.harvesting = true;
      }

      if (creep.memory.harvesting) {
         var deposit_structure_types = [
            STRUCTURE_EXTENSION,
            STRUCTURE_SPAWN,
            STRUCTURE_TOWER,
         ];
         var deposit_targets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
               return structure.energy < structure.energyCapacity &&
                     _.contains(
                           deposit_structure_types,
                           structure.structureType);
            }
         });
         if (deposit_targets.length > 0) {
            if (creep.transfer(deposit_targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
               creep.moveTo(deposit_targets[0]);
            }
         } else {
            creep.moveTo(Game.flags.Idle);
         }
      } else {
         var sources = creep.room.find(FIND_SOURCES);
         // TODO: Prioritize sources by distance to creep.
         if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(sources[0]);
         }
      }
   }
};
