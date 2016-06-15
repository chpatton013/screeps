'use strict';

module.exports = function(name, required_body_components) {
   return {
      name: name,
      required_body_components: required_body_components,
      run: function(creep) {
         creep.moveTo(Game.flags.Idle);
         return true;
      },
   };
};
