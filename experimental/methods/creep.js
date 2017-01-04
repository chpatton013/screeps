"use strict";

module.exports = function() {
   function idle() {
      return OK;
   }

   // TODO: support multiple argument types
   function move(target) {
      return this.moveTo(target);
   }

   // TODO: implement me
   function travel() {
      throw new Exception("Travel is not implemented");
   }

   return {
      idle: idle,
      move: move,
      travel: travel,
   };
}();
