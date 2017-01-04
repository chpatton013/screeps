"use strict";

var CreepMethods = require("./methods/creep")
var ExtensionMethods = require("./methods/extension")
var LinkMethods = require("./methods/link")
var SpawnMethods = require("./methods/spawn")
var TowerMethods = require("./methods/tower")

module.exports = function() {
   Creep.prototype._idle = CreepMethods.idle;
   Creep.prototype._move = CreepMethods.move;
   Creep.prototype._travel = CreepMethods.travel;

   StructureExtension.prototype._transfer = ExtensionMethods.transfer;

   StructureLink.prototype._transfer = LinkMethods.transfer;

   StructureSpawn.prototype._createCreep = SpawnMethods.create;
   StructureSpawn.prototype._transfer = SpawnMethods.transfer;

   StructureTower.prototype._transfer = TowerMethods.transfer;
};
