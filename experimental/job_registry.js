"use strict";

var Jobs = require('./constants/jobs');
var Stages = require('./constants/stages');
var StageRegistry = require('./stage_registry');

module.exports = function() {
   // build: move to storage; withdraw energy; move to site; build
   // deposit: move to storage; transfer
   // dismantle: move to structure; dismantle
   // drop: move to target; drop
   // harvest: move to source; harvest
   // pickup: move to target; pickup
   // renew: move to spawn; renew
   // repair: withdraw energy; move to structure; repair
   // upgrade_controller: move to storage; transfer; move to controller; upgrade
   // withdraw: move to storage; transfer


   // stages: list of compound type
   //    precondition
   //    tasks
   // walk backward through stages until you find an entity that meets the
   // precondition


   // JOB_BUILD
   //
   // creep build
   // creep move to construction site
   //    creep with enough energy
   //    construction site
   // creep withdraw energy
   // creep move to storage
   //    creep without enough energy
   //    storage with enough energy

	function sort_by_distance(targets, position, get_target) {
		if (!get_target) {
			get_target = function(x) { return x; };
		}

		var square_distances = {};
		for (var index in targets) {
			var target = get_target(targets[index]);
			var dx = position.x - target.pos.x;
			var dy = position.y - target.pos.y;
			square_distances[target.id] = dx * dx + dy * dy;
		}

		var sorted_targets = targets.slice(0);
		sorted_targets.sort(function(a, b) {
			return square_distances[a.id] - square_distances[b.id];
		});
		return sorted_targets;
	}

   // Change of plans
   // pre-calculate arguments for job
   // pass arguments across stages

   return {
      [JOB_BUILD]: [{
         stage: StageRegistry[STAGE_BUILD],
         get_arguments: function() {
            var site = Game.constructionSites[0];
            var creeps = site.room.find(FIND_MY_CREEPS, {
               filter: function(creep) {
                  return creep.carry.energy > 0;
               },
            });
            var creep = sort_by_distance(site, creeps)[0];
            return [creep, site];
         },
      }, {
         stage: StageRegistry[STAGE_WITHDRAW],
         get_arguments: function() {
            return [creep, storage, RESOURCE_ENERGY, amount];
         },
      }],
      [JOB_DEPOSIT]: [{
      }, {
      }],
      [JOB_DISMANTLE]: [{
      }, {
      }],
      [JOB_DROP]: [{
      }, {
      }],
      [JOB_HARVEST]: [{
      }, {
      }],
      [JOB_PICKUP]: [{
      }, {
      }],
      [JOB_RENEW]: [{
      }, {
      }],
      [JOB_REPAIR]: [{
      }, {
      }],
      [JOB_UPGRADE_CONTROLLER]: [{
      }, {
      }],
      [JOB_WITHDRAW]: [{
      }, {
      }],
   };
}();
