{ //#region modals
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
						scope.periodTasks.push({ 'isAbsense': true, 'task_id': scope.absense._id, 'taskName': scope.absense.name, 'taskDescription': scope.absense.description, 'uid': scope.absense.uid, 'time': [], 'authHours': 0 });
					element.modal('hide');
				};
			}
		};
	}]);

	timeTracker.directive('addLaborModal', ['HelperSvc', function(HelperSvc) {
		return {
			restrict: 'A',
			templateUrl: 'templates/addLaborForm.html',
			replace: true,
			link: function (scope, element, attrs) {
			
				HelperSvc.getUserTaskBank(user2_id).then(function(data) {
					scope.laborOptions = data;
				});
			
				scope.addLabor = function() {
					if(scope.labor != undefined)
					{
						scope.periodTasks.push({ 'isAbsense': false, 'task_id': scope.labor._id, 'taskName': scope.labor.name, 'taskDescription': scope.labor.description, 'uid': scope.labor.uid, 'time': [], 'authHours': 0 });
					}
					element.modal('hide');
				};
			}
		};
	}]);
	
	timeTracker.directive('addTaskModal', ['HelperSvc', function(HelperSvc) {
		return {
			restrict: 'A',
			templateUrl: 'templates/addLaborForm.html',
			replace: true,
			link: function (scope, element, attrs) {
			
				HelperSvc.getUserTaskBank(user2_id).then(function(data) {
					scope.laborOptions = data;
				});
			
				scope.addLabor = function() {
					if(scope.labor != undefined)
					{
						scope.periodTasks.push({ 'isAbsense': false, 'task_id': scope.labor._id, 'taskName': scope.labor.name, 'taskDescription': scope.labor.description, 'uid': scope.labor.uid, 'time': [], 'authHours': 0 });
					}
					element.modal('hide');
				};
			}
		};
	}]);
} //#endregion

timeTracker.directive('tooltip', function () {
    return {
        restrict:'A',
        link: function(scope, element, attrs) {
            $(element).tooltip({placement: 'right'})
        }
    }
});