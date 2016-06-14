'use strict';

module.exports = {
   run: function(creep) {
      // memory: Upgrading defined as the return trip to the upgrade site.
      if (creep.memory.upgrading && creep.carry.energy == 0) {
         creep.memory.upgrading = false;
      }
      if (!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
         creep.memory.upgrading = true;
      }

      if (creep.memory.upgrading) {
         if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller);
         }
      } else {
         var storage_structure_types = [
            STRUCTURE_EXTENSION,
            STRUCTURE_SPAWN,
         ];
         var storage_targets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
               return structure.energy > 0 &&
                     _.contains(
                           storage_structure_types,
                           structure.structureType);
            }
         });
         var energy_levels = _.map(storage_targets, (target) => target.energy)
         var energy_reserve = _.reduce(
               energy_levels,
               (accumulator, value) => accumulator + value,
               0);

         var HARVESTER_BODY_COST = 300;
         if (energy_reserve > HARVESTER_BODY_COST) {
            // TODO: Prioritize storage_targets by distance to creep.
            var target = storage_targets[0];

            var transfer_amount = Math.max(
                  target.energy,
                  creep.carryCapacity - creep.carry.energy);
            transfer_amount = Math.min(
                  transfer_amount,
                  energy_reserve - HARVESTER_BODY_COST)
            if (target.transferEnergy(creep, transfer_amount) == ERR_NOT_IN_RANGE) {
               creep.moveTo(target);
            }
         } else {
            creep.moveTo(Game.flags.Idle);
         }
      }
   }
};
