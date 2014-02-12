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