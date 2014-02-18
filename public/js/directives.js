timeTracker.directive('addAbsenseModal', ['Api', 'ApiType', function(Api, ApiType) {
	return {
		restrict: 'A',
		templateUrl: 'templates/addAbsenseForm.html',
		replace: true,
		link: function (scope, element, attrs) {
			var absenses = Api.call(ApiType.absenses).getAll();
			absenses.$promise.then(function(data) {
				scope.absenses = data;
			});
		
			scope.addAbsense = function() {
				if(scope.absense != undefined)
					scope.tasks.push({ "task_id": scope.absense._id, "taskName": scope.absense.name, "taskDescription": scope.absense.description, "uid": scope.absense._id, "time": [] });
				element.modal('hide');
			};
		}
	};
}]);

timeTracker.directive('addLaborModal', ['Api', 'ApiType', function(Api, ApiType) {
	return {
		restrict: 'A',
		templateUrl: 'templates/addLaborForm.html',
		replace: true,
		link: function (scope, element, attrs) {
			var laborOptions = Api.call(ApiType.tasks).getAll();
			laborOptions.$promise.then(function(data) {
				scope.laborOptions = data;
			});
		
			scope.addLabor = function() {
				if(scope.labor != undefined)
				{
					//scope.tasks.push({ "task_id": scope.labor._id, "taskName": scope.labor.name, "taskDescription": scope.labor.description, "uid": scope.labor.uid, "time": [] });
					scope.taskObj.periods[0].tasks.push({ "task_id": scope.labor._id, "taskName": scope.labor.name, "taskDescription": scope.labor.description, "uid": scope.labor.uid, "time": [] });;
					scope.taskObj.$update({id:scope.taskObj._id});
				}
				element.modal('hide');
			};
		}
	};
}]);