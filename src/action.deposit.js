'use strict';

var utilities = require('utilities');

module.exports = function(name, required_body_components) {
   var deposit_structure_types = [
      STRUCTURE_EXTENSION,
      STRUCTURE_SPAWN,
      STRUCTURE_TOWER,
      STRUCTURE_STORAGE,
   ];

   function get_deposit_targets(room) {
      return room.find(FIND_STRUCTURES, {
         filter: function(structure) {
            var needs_energy = structure.energy < structure.energyCapacity;
            var is_deposit_structure = _.contains(
                  deposit_structure_types,
                  structure.structureType);
            return needs_energy && is_deposit_structure;
         },
      });
   }

   return {
      name: name,
      required_body_components: required_body_components,
      deposit_structure_types: deposit_structure_types,
      get_deposit_targets: utilities.get_deposit_targets,
      run: function(creep) {
         var deposit_targets = utilities.get_deposit_targets(creep.room);
         if (deposit_targets.length > 0) {
            var target = utilities.sort_by_distance(
                  deposit_targets[0],
                  creep.pos)[0];
            var deposit_result = creep.transfer(target, RESOURCE_ENERGY);
            if (deposit_result == ERR_NOT_IN_RANGE) {
               creep.moveTo(target);
            } else if (deposit_result != OK) {
               console.log('Failed to deposit:', deposit_result);
               return false;
            }
            return true;
         }
         return false;
      },
   };
};
