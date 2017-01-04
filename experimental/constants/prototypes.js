"use strict";

var Entities = require("./entities");

module.exports = {
   [ENTITY_TYPE_CREEP]: Creep,
   [ENTITY_TYPE_CONTAINER]: StructureContainer,
   [ENTITY_TYPE_EXTENSION]: StructureExtension,
   [ENTITY_TYPE_LAB]: StructureLab,
   [ENTITY_TYPE_LINK]: StructureLink,
   [ENTITY_TYPE_NUKER]: StructureNuker,
   [ENTITY_TYPE_OBSERVER]: StructureObserver,
   [ENTITY_TYPE_RAMPART]: StructureRampart,
   [ENTITY_TYPE_SPAWN]: StructureSpawn,
   [ENTITY_TYPE_STORAGE]: StructureStorage,
   [ENTITY_TYPE_TERMINAL]: StructureTerminal,
   [ENTITY_TYPE_TOWER]: StructureTower,
};
