'use strict';

var utilities = require('utilities');

module.exports = function(name, required_body_components) {
   return {
      name: name,
      required_body_components: required_body_components,
      run: function(creep) {
         function attack(target) {
            var attack_result = creep.attack(target);
            if (attack_result == ERR_NOT_IN_RANGE) {
               creep.moveTo(target);
            } else if (attack_result != OK) {
               console.log('Failed to attack:', attack_result);
               return false;
            }
            return true;
         }

         var explicit_target = Game.getObjectById(creep.memory.target);
         if (explicit_target && attack(target)) {
            console.log('attacking explicit target');
            return true;
         }

         var attack_targets = utilities.get_hostile_targets(creep.room);
         if (attack_targets.length) {
            var target = utilities.sort_by_distance(
                  attack_targets[0],
                  creep.pos)[0];
            if (attack(target)) {
               return true;
            }
         }

         return false;
      },
   };
};
