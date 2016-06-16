'use strict';

var Cleanup = require('cleanup');
var Spawn = require('spawn');
var Role = require('role');

module.exports.loop = function() {
   Cleanup.run();
   Spawn.run();
   Role.run();
};
