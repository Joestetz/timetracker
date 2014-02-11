timeTracker.directive('addAbsenseModal', ['AbsensesFactory', function(AbsensesFactory) {
	return {
		restrict: 'A',
		templateUrl: 'templates/addAbsenseForm.html',
		replace: true,
		link: function (scope, element, attrs) {
			var absenses = AbsensesFactory.query();
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