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
				create: { method: "POST" }
			});	
		};
		
		var entity = function() {
			return $resource(baseUrl + '/:id', {}, {
				show: { method: "GET" },
				update: { method: "PUT", params: {id: "@id"} },
				delete: { method: "DELETE", params: {id: "@id"} }
			});
		};
		
		var queryFn = function() {
			return collection().query();
		};
		
		var showFn = function(params) {
			return entity().show(params);
		};
		
		var updateFn = function(params) {
			return entity().update(params);
		};
		
		return {
			getAll: queryFn,
			getById: showFn,
			update: updateFn
		};
	};
	
	return {
		call: callFn
	};
});