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
					var matches = jQuery.grep(scope.periodTasks, function(e, i) {
						return e.task_id == scope.absense._id;
					});
					if(scope.absense != undefined && matches.length == 0)
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
					var matches = jQuery.grep(scope.periodTasks, function(e, i) {
						return e.task_id == scope.labor._id;
					});
					if(scope.labor != undefined && matches.length == 0)
					{
						scope.periodTasks.push({ 'isAbsense': false, 'task_id': scope.labor._id, 'taskName': scope.labor.name, 'taskDescription': scope.labor.description, 'uid': scope.labor.uid, 'time': [], 'authHours': 0 });
					}
					element.modal('hide');
				};
			}
		};
	}]);
	
	timeTracker.directive('addTaskModal', ['HelperSvc', 'Api', 'ApiType',
		function(HelperSvc, Api, ApiType) {
			return {
				restrict: 'A',
				templateUrl: 'templates/addTaskForm.html',
				replace: true,
				link: function (scope, element, attrs) {
					scope.addClicked = false;
					
					scope.addTask = function() {
						scope.addClicked = true;
						if(!scope.addTaskId) return;
						Api.call(ApiType.tasks).getOneByParams({ uid: scope.addTaskId }).$promise.then(function(data) {
							if(data.uid && data.uid == scope.addTaskId) {
								addTaskSuccess(data);
							} else {
								addTaskFail();
							}
						});
					};
					
					var addTaskSuccess = function(task) {
						Api.call(ApiType.users).updateRef({ id: user2_id, ref: task._id }).$promise.then(function(data) {
							if(data.taskBank.length == scope.tasks.length + 1) scope.tasks.push(task);
							scope.addTaskForm.taskId.$setValidity('isValid', true);
							element.modal('hide');
						});
					};
					
					var addTaskFail = function() {
						scope.addTaskForm.taskId.$setValidity('isValid', false);
					};
				}
			};
		}
	]);
} //#endregion

timeTracker.directive('tooltip', function () {
    return {
        restrict:'A',
        link: function(scope, element, attrs) {
            $(element).tooltip({placement: 'right'})
        }
    }
});