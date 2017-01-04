"use strict";

var Methods = require("./methods");
var MemoryCleanup = require("./memory_cleanup");

module.exports.loop = function() {
   Methods();
   MemoryCleanup();
};
