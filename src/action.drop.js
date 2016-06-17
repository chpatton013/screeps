'use strict';

var utilities = require('utilities');

module.exports = function(name, required_body_components) {
   return {
      name: name,
      required_body_components: required_body_components,
      run: function(creep) {
			for (var resource_name in creep.carry) {
				creep.drop(resource_name);
			}
			return true;
      },
   };
};
