'use strict';

module.exports = function(name, quota, body_components) {
   function get_body_definition() {
      var body_parts = [];
      for (var component_type in body_components) {
         var amount = body_components[component_type];
         body_parts = body_parts.concat(new Array(amount).fill(component_type));
      }
      return body_parts;
   }

   return {
      name: name,
      quota: quota,
      body_components: body_components,
      get_body_definition: get_body_definition,
      run: function(creep) {
         // memory: Building defined as the return trip to the construction site.
         if (creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
         }
         if (!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
         }

         if (creep.memory.building) {
            var construction_targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if (construction_targets.length) {
               if (creep.build(construction_targets[0]) == ERR_NOT_IN_RANGE) {
                  creep.moveTo(construction_targets[0]);
               }
            }
         } else {
            var storage_structure_types = [
               STRUCTURE_EXTENSION,
               STRUCTURE_SPAWN,
            ];
            var storage_targets = creep.room.find(FIND_STRUCTURES, {
               filter: function(structure) {
                  return structure.energy > 0 &&
                        _.contains(
                              storage_structure_types,
                              structure.structureType);
               }
            });
            var energy_levels = _.map(
                  storage_targets,
                  function(target) { return target.energy; });
            var energy_reserve = _.reduce(
                  energy_levels,
                  function(accumulator, value) { return accumulator + value; },
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
};
