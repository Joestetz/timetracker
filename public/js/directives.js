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
					scope.tasks.push({ 'isAbsense': true, 'task_id': scope.absense._id, 'taskName': scope.absense.name, 'taskDescription': scope.absense.description, 'uid': scope.absense.uid, 'time': [], 'authHours': 0 });
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
			var taskBank = Api.call(ApiType.users + '/' + user2_id).getById();
			taskBank.$promise.then(function(data) {
				var taskArr = jQuery.map(data.taskBank, function(e, i) {
					return e.task_id;
				});
				var laborOptions = Api.call(ApiType.tasks).getAll({ids: taskArr });
				laborOptions.$promise.then(function(data) {
					scope.laborOptions = data;
				});
			});
		
			scope.addLabor = function() {
				if(scope.labor != undefined)
				{
					scope.tasks.push({ 'isAbsense': false, 'task_id': scope.labor._id, 'taskName': scope.labor.name, 'taskDescription': scope.labor.description, 'uid': scope.labor.uid, 'time': [], 'authHours': 0 });
				}
				element.modal('hide');
			};
		}
	};
}]);

timeTracker.directive('tooltip', function () {
    return {
        restrict:'A',
        link: function(scope, element, attrs) {
            $(element).tooltip({placement: 'right'})
        }
    }
});