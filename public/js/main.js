/*
 * Time Tracker AngularJS App
 * By Joseph Stetzer, Joestetz@gmail.com
 */
 
var timeTracker = angular.module('timeTracker', ['ngRoute', 'apiServices']);
var user2_id = "52f78c914293916d8c8c281b";

timeTracker.config(['$routeProvider',
	function ($routeProvider) {
	$routeProvider
		.when('/', { templateUrl: 'partials/home.html' })
		.when('/time', { templateUrl: 'partials/enterTime.html' })
		.when('/tasks', { templateUrl: 'partials/myTasks.html' })
		.when('/manage/tasks', { templateUrl: 'partials/manageTasks.html' })
		.when('/manage/periods', { templateUrl: 'partials/managePeriods.html' })
		.when('/manage/users', { templateUrl: 'partials/manageUsers.html' })
		.when('/test', { templateUrl: 'partials/test.html' })
		.otherwise({
			redirectTo: '/'
		});
	}
]);

{ //#region Filters
	timeTracker.filter('range', function() {
		return function(input, total) {
			total = parseInt(total);
			for (var i=0; i<total; i++)
				input.push(i);
			return input;
		};
	});
	
	timeTracker.filter('dateInPeriod', function() {
		var parseDayOfWeek = function(day) {
			var str = "";
			switch(day){
				case 0:
					str = "Sun";
					break;
				case 1:
					str = "Mon";
					break;
				case 2:
					str = "Tue";
					break;
				case 3:
					str = "Wed";
					break;
				case 4:
					str = "Thu";
					break;
				case 5:
					str = "Fri";
					break;
				case 6:
					str = "Sat";
					break;
			}
			return str;
		}
		return function(input, total, startDate) {
			var date = new Date(startDate);
			total = parseInt(total);
			
			for (var i=0; i<total; i++)
			{
				input.push(parseDayOfWeek(date.getDay()) + " " + (date.getMonth() + 1) + "/" + date.getDate());
				date.setDate(date.getDate() + 1);
			}
				
			return input;
		};
	});
} //#endregion

{ //#region Controllers
	timeTracker.controller('headerController', ['$scope', '$location',
		function($scope, $location){
			$scope.isActive = function (viewLocation) { 
				return viewLocation === $location.path();
			};
		}
	]);

	timeTracker.controller('enterTimeController', ['$scope', 'Api', 'ApiType',
		function($scope, Api, ApiType){
			var populateTime = function(pid, onlyTasks) {
				var time = Api.call(ApiType.time).getOneByParams({user: user2_id, period: pid});
				
				return time.$promise.then(function(data) {
					if (data.tasks && data.tasks.length > 0)
					{
						$scope.periodTasks = data.tasks;
						$scope.timeId = data._id;
						if (onlyTasks)
						{
							angular.forEach($scope.periodTasks, function(v,k) {
								v.time.length = 0;
								v.authHours = null;
							});
						}
					} else {
						$scope.periodTasks = null;
					}
				});
			};
			
			var period = Api.call(ApiType.periods).getAll();
			period.$promise.then(function(data) {
				$scope.periods = data;
				$scope.period = data[0];
				populateTime($scope.period._id).then(function (){
					if($scope.periodTasks == null)
						populateTime($scope.periods[1]._id, true);
				});
			});
			
			$scope.changePeriod = function() {
				populateTime($scope.period._id);
			};
			
			$scope.isError = function(task) {
				return $scope.sumHoursTask(task) > task.authHours;
			}
			
			$scope.sumHoursDay = function(day) {
				var sum = 0.00;
				if ($scope.periodTasks)
				{
					$.each($scope.periodTasks, function(i, e) {
						sum += (e.time[day] ? e.time[day] : 0);
					});
				}
				return sum;
			}
			
			$scope.sumHoursTask = function(task) {
				var sum = 0.00;
				$.each(task.time, function(i, e) {
					sum += e;
				});
				return sum;
			}
			
			$scope.sumTotalHours = function() {
				var sum = 0.00;
				if ($scope.periodTasks)
				{
					$.each($scope.periodTasks, function(i, e) {
						sum += $scope.sumHoursTask(e);
					});
				}
				return sum;
			}
			
			$scope.sumAuthHours = function() {
				var sum = 0.00;
				if ($scope.periodTasks)
				{
					$.each($scope.periodTasks, function(i, e) {
						sum += e.authHours;
					});
				}
				return sum;
			}
			
			$scope.saveTime = function() {
				Api.call(ApiType.time).update({id: $scope.timeId }, angular.copy($scope.periodTasks));
			};
			
			$scope.submitTime = function() {
				alert("Not implemented.");
			};
			
			$scope.deleteTime = function(taskId) {
				if(confirm('Are you sure you want to delete this row?'))
				{
					$scope.periodTasks = jQuery.grep($scope.periodTasks, function(e, i) {
						return (e.task_id != taskId);
					});
				}
			};
		}
	]);
	
	timeTracker.controller('myTasksController', ['$scope', 'HelperSvc', 'Api', 'ApiType',
		function($scope, HelperSvc, Api, ApiType){
			HelperSvc.getUserTaskBank(user2_id).then(function(data) {
				$scope.tasks = data;
			});
			
			$scope.deleteTask = function(taskId) {
				if(confirm('Are you sure you want to delete this task?'))
				{
					Api.call(ApiType.users).getById({id: user2_id});
				}
			};
		}
	]);

	timeTracker.controller('testService', ['$scope', 'Api', 'ApiType',
		function($scope, Api, ApiType) {			
			$scope.absenses = Api.call(ApiType.absenses).getAll();
			
			$scope.changeSelected = function() {
				// var a = Api.call(ApiType.absenses).getById({id: $scope.selectedId});
				// a.$promise.then(function(data) {
					// $scope.selected = data;
				// });
				$scope.selected = Api.call(ApiType.absenses).getById({id: $scope.selectedId});
			};
		}
	]);
} //#endregion