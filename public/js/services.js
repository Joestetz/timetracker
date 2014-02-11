var services = angular.module('apiServices', ['ngResource']);

services.factory('AbsensesFactory', function($resource) {
	return $resource('/api/absenses', {}, {
		query: { method: "GET", isArray: true },
		create: { method: "POST" }
	});
});

services.factory('AbsenseFactory', function($resource) {
	return $resource('/api/absenses/:id', {}, {
		show: { method: "GET" },
		update: { method: "PUT", params: {id: "@id"} },
		delete: { method: "DELETE", params: {id: "@id"} }
	});
});

services.factory('UsersFactory', function($resource) {
	return $resource('/api/users', {}, {
		query: { method: "GET", isArray: true },
		create: { method: "POST" }
	});
});

services.factory('UserFactory', function($resource) {
	return $resource('/api/users/:id', {}, {
		show: { method: "GET" },
		update: { method: "PUT", params: {id: "@id"} },
		delete: { method: "DELETE", params: {id: "@id"} }
	});
});

services.factory('PeriodsFactory', function($resource) {
	return $resource('/api/periods', {}, {
		query: { method: "GET", isArray: true },
		create: { method: "POST" }
	});
});

services.factory('PeriodFactory', function($resource) {
	return $resource('/api/periods/:id', {}, {
		show: { method: "GET" },
		update: { method: "PUT", params: {id: "@id"} },
		delete: { method: "DELETE", params: {id: "@id"} }
	});
});

services.factory('TasksFactory', function($resource) {
	return $resource('/api/tasks', {}, {
		query: { method: "GET", isArray: true },
		create: { method: "POST" }
	});
});

services.factory('TaskFactory', function($resource) {
	return $resource('/api/tasks/:id', {}, {
		show: { method: "GET" },
		update: { method: "PUT", params: {id: "@id"} },
		delete: { method: "DELETE", params: {id: "@id"} }
	});
});

services.factory('TimeFactory', function($resource) {
	return $resource('/api/time', {}, {
		query: { method: "GET", isArray: true },
		create: { method: "POST" },
		getByUserAndPeriod: { method: "GET" }//, params: {uid: "@uid", pid: "@pid"} }
	});
});

services.factory('TimeEntryFactory', function($resource) {
	return $resource('/api/time/:id', {}, {
		show: { method: "GET" },
		update: { method: "PUT", params: {id: "@id"} },
		delete: { method: "DELETE", params: {id: "@id"} }
	});
});