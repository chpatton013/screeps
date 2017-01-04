"use strict";

var Tasks = require("./constants/tasks");
var Entities = require("./constants/entities");
var Prototypes = require("./constants/prototypes");
var Results = require("./constants/results");

module.exports = function() {
   function delegate_task(task_name, method) {
      return function() {
         var result = method.apply(this, arguments);
         if (result == OK) {
            return true;
         } else {
            var error = Results[result] || "ERR_UNKNOWN";
            console.log("Task " + task_name + " failed: " + error);
            return false;
         }
      };
   }

   function build_task(proto, task_name, method_name) {
      var method = proto.prototype[method_name];
      if (!method) {
         throw new Exception("Method " + method_name + " does not exist");
      }

      return delegate_task(task_name, method);
   }

   function build_task_group(entity, group) {
      var proto = Prototypes[entity];
      if (!proto) {
         throw new Exception("Entity " + entity + " not found");
      }

      var tasks = {};
      for (var index = 0; index < group.length; ++index) {
         var task = group[index].task;
         var method = group[index].method;
         var range = group[index].range;
         var required_body_components = group[index].required_body_components;

         tasks[task] = {};
         tasks[task].entity = entity;
         if (range !== undefined) {
            tasks[task].range = range;
         }
         if (required_body_components !== undefined) {
            tasks[task].required_body_components = range;
         }
         tasks[task].run = build_task(proto, task, method);
      }
      return tasks;
   }

   function build_all_tasks(definitions) {
      var tasks = {};
      for (var index = 0; index < definitions.length; ++index) {
         var entity = definitions[index].entity;
         var groups = definitions[index].groups;
         tasks[entity] = build_task_group(entity, groups);
      }
      return tasks;
   }

   return build_all_tasks([{
      entity: ENTITY_CREEP,
      groups: [{
         task: CREEP_TASK_ATTACK,
         method: "attack",
         range: undefined,
         required_body_components: [ATTACK],
      }, {
         task: CREEP_TASK_ATTACK_CONTROLLER,
         method: "attackController",
         range: undefined,
         required_body_components: new Array(5).fill(CLAIM),
      }, {
         task: CREEP_TASK_BUILD,
         method: "build",
         range: undefined,
         required_body_components: [WORK],
      }, {
         task: CREEP_TASK_CLAIM_CONTROLLER,
         method: "claimController",
         range: undefined,
         required_body_components: [CLAIM],
      }, {
         task: CREEP_TASK_DISMANTLE,
         method: "dismantle",
         range: undefined,
         required_body_components: [WORK],
      }, {
         task: CREEP_TASK_DROP,
         method: "drop",
         range: undefined,
         required_body_components: [CARRY],
      }, {
         task: CREEP_TASK_HARVEST,
         method: "harvest",
         range: undefined,
         required_body_components: [WORK],
      }, {
         task: CREEP_TASK_HEAL,
         method: "heal",
         range: undefined,
         required_body_components: [HEAL],
      }, {
         task: CREEP_TASK_IDLE,
         method: "_idle",
         range: undefined,
         required_body_components: [],
      }, {
         task: CREEP_TASK_MOVE,
         method: "_move",
         range: undefined,
         required_body_components: [MOVE],
      }, {
         task: CREEP_TASK_PICKUP,
         method: "pickup",
         range: undefined,
         required_body_components: [CARRY],
      }, {
         task: CREEP_TASK_RANGED_ATTACK,
         method: "rangedAttack",
         range: undefined,
         required_body_components: [RANGED_ATTACK],
      }, {
         task: CREEP_TASK_RANGED_HEAL,
         method: "heal",
         range: undefined,
         required_body_components: [HEAL],
      }, {
         task: CREEP_TASK_RANGED_MASS_ATTACK,
         method: "rangedMassAttack",
         range: undefined,
         required_body_components: [RANGED_ATTACK],
      }, {
         task: CREEP_TASK_RESERVE_CONTROLLER,
         method: "reserveController",
         range: undefined,
         required_body_components: [CLAIM],
      }, {
         task: CREEP_TASK_REPAIR,
         method: "repair",
         range: undefined,
         required_body_components: [BUILD],
      }, {
         task: COMMON_TASK_TRANSFER,
         method: "transfer",
         range: undefined,
         required_body_components: [CARRY],
      }, {
         task: CREEP_TASK_TRAVEL,
         method: "_travel",
         range: undefined,
         required_body_components: [MOVE],
      }, {
         task: CREEP_TASK_UPGRADE_CONTROLLER,
         method: "upgradeController",
         range: undefined,
         required_body_components: [CARRY, WORK],
      }],
   }, {
      entity: ENTITY_CONTAINER,
      groups: [{
         task: COMMON_TASK_TRANSFER,
         method: "transfer",
         range: undefined,
      }],
   }, {
      entity: ENTITY_EXTENSION,
      groups: [{
         task: COMMON_TASK_TRANSFER,
         method: "_transfer",
         range: undefined,
      }],
   }, {
      entity: ENTITY_LAB,
      groups: [{
         task: LAB_TASK_BOOST,
         method: "boost",
         range: undefined,
      }, {
         task: LAB_TASK_REACTION,
         method: "reaction",
         range: undefined,
      }, {
         task: COMMON_TASK_TRANSFER,
         method: "transfer",
         range: undefined,
      }],
   }, {
      entity: ENTITY_LINK,
      groups: [{
         task: COMMON_TASK_TRANSFER,
         method: "_transfer",
         range: undefined,
      }],
   }, {
      entity: ENTITY_NUKER,
      groups: [{
         task: NUKER_TASK_LAUNCH,
         method: "launch",
         range: undefined,
      }],
   }, {
      entity: ENTITY_OBSERVER,
      groups: [{
         task: OBSERVER_TASK_OBSERVE,
         method: "observe",
         range: undefined,
      }],
   }, {
      entity: ENTITY_RAMPART,
      groups: [{
         task: RAMPART_TASK_PUBLIC,
         method: "public",
         range: undefined,
      }],
   }, {
      entity: ENTITY_SPAWN,
      groups: [{
         task: SPAWN_TASK_CREATE,
         method: "_createCreep",
         range: undefined,
      }, {
         task: SPAWN_TASK_RECYCLE,
         method: "recycleCreep",
         range: undefined,
      }, {
         task: SPAWN_TASK_RENEW,
         method: "renewCreep",
         range: undefined,
      }, {
         task: COMMON_TASK_TRANSFER,
         method: "_transfer",
         range: undefined,
      }],
   }, {
      entity: ENTITY_STORAGE,
      groups: [{
         task: COMMON_TASK_TRANSFER,
         method: "transfer",
         range: undefined,
      }],
   }, {
      entity: ENTITY_TERMINAL,
      groups: [{
         task: TERMINAL_TASK_SEND,
         method: "send",
         range: undefined,
      }, {
         task: COMMON_TASK_TRANSFER,
         method: "transfer",
         range: undefined,
      }],
   }, {
      entity: ENTITY_TOWER,
      groups: [{
         task: TOWER_TASK_ATTACK,
         method: "attack",
         range: undefined,
      }, {
         task: TOWER_TASK_HEAL,
         method: "heal",
         range: undefined,
      }, {
         task: TOWER_TASK_REPAIR,
         method: "repair",
         range: undefined,
      }, {
         task: COMMON_TASK_TRANSFER,
         method: "_transfer",
         range: undefined,
      }],
   }]);
}();
