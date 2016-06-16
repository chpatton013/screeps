'use strict';

var Cleanup = require('cleanup');
var Spawn = require('spawn');
var Tower = require('tower');
var Role = require('role');

module.exports.loop = function() {
   Cleanup.run();
   Spawn.run();
   Tower.run();
   Role.run();
};
