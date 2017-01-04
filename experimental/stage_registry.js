"use strict";

var Stages = require('./constants/stages');
var Tasks = require('./constants/tasks');

module.exports = function() {
   function get_required_body_components(tasks) {
      var stage_components = {};

      for (var task_index = 0; index < tasks.length; ++task_index) {
         var task = Creep.prototype.tasks[tasks[task_index]];
         if (task && task.required_body_components) {
            var task_components = {};

            for (var body_index = 0;
                  body_index < task.required_body_components.length;
                  ++body_index) {
               var component = task.required_body_components[body_index];
               task_components[component] =
                     (task_components[component] || 0) + 1;
            }

            for (var component in task_components) {
               var task_component = task_components[component];
               stage_components[component] = Math.max(
                     (stage_components[component] || task_component),
                     task_component);
            }
         }
      }

      if (_.isEmpty(stage_components)) {
         return undefined;
      } else {
         return stage_components;
      }
   }

   function build_stage(tasks, run) {
      return {
         tasks: tasks,
         run: run,
         required_body_components: get_required_body_components(tasks),
      };
   }

   function build_all_stages(definitions) {
      var stages = {};
      for (var index = 0; index < definitions.length; ++index) {
         var stage = definitions[index];
         stages[stage.stage] = build_stage(stage.tasks, stage.run);
      }
      return stages;
   }

   return build_all_stages([{
      stage: STAGE_BUILD,
      tasks: [CREEP_TASK_BUILD, CREEP_TASK_MOVE],
      run: function(creep, site) {
         var task_build = creep.tasks[CREEP_TASK_BUILD];
         var task_move = creep.tasks[CREEP_TASK_MOVE];
         if (creep.pos.getRangeTo(site) > task_build.range) {
            return task_move.bind(creep).run(site);
         } else {
            return task_build.bind(creep).run(site);
         }
      },
   }, {
      stage: STAGE_WITHDRAW,
      tasks: [COMMON_TASK_TRANSFER, CREEP_TASK_MOVE],
      run: function(creep, storage, resource, amount) {
         var task_transfer = storage.tasks[COMMON_TASK_TRANSFER];
         var task_move = creep.tasks[CREEP_TASK_MOVE];
         if (creep.pos.getRangeTo(storage) > task_transfer.range) {
            return task_move.bind(creep).run(storage);
         } else {
            return task_transfer.bind(storage).run(creep, resource, amount);
         }
      },
   }]);
}();
