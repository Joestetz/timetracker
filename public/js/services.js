var services = angular.module('apiServices', ['ngResource']);

services.constant('ApiType', {
	absenses: "/api/absenses",
	users: "/api/users",
	periods: "/api/periods",
	tasks: "/api/tasks",
	time: "/api/time"
});

// Api.call('/api/absenses').getAll()
services.factory('Api', function($resource) {
	var callFn = function(baseUrl) {
		var collection = function() {
			return $resource(baseUrl, {}, {
				query: { method: "GET", isArray: true },
				create: { method: "POST" },
				getOneByParams: { method: "GET" }
			});
		};
		
		var entity = function() {
			return $resource(baseUrl + '/:id', {}, {
				show: { method: "GET" },
				update: { method: "PUT", params: {id: "@id"} },
				delete: { method: "DELETE", params: {id: "@id"} }
			});
		};
		
		var queryFn = function(params) {
			return collection().query(params);
		};
		
		var showFn = function(params) {
			return entity().show(params);
		};
		
		var updateFn = function(params, postData) {
			return entity().update(params, postData);
		};
		
		var getOneByParamsFn = function(params) {
			return collection().getOneByParams(params);
		};
		
		return {
			getAll: queryFn,
			getById: showFn,
			update: updateFn,
			getOneByParams: getOneByParamsFn // get a single record based on filter criteria
		};
	};
	
	return {
		call: callFn
	};
});

// More complex and reusable services go here
services.service('HelperSvc', ['Api', 'ApiType', '$q',
	function(Api, ApiType, $q){
		// Gets the task bank with all task info for a specific user
		this.getUserTaskBank = function(user_id) {
			var tasks = $q.defer();
			Api.call(ApiType.users).getById({id: user_id}).$promise.then(function(data) {
				var taskArr = jQuery.map(data.taskBank, function(e, i) {
					return e.task_id;
				});
				
				tasks.resolve(Api.call(ApiType.tasks).getAll({ids: taskArr }).$promise);
			});
			
			return tasks.promise;
		};
	}
]);