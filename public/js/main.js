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

{ // Filters
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
}

{ // Controllers
	timeTracker.controller('headerController', ['$scope', '$location',
		function($scope, $location){
			$scope.isActive = function (viewLocation) { 
				return viewLocation === $location.path();
			};
		}
	]);

	timeTracker.controller('enterTimeController', ['$scope', 'PeriodsFactory', 'TimeFactory',
		function($scope, PeriodsFactory, TimeFactory){
			var populateTime = function(pid, onlyTasks) {
				var time = TimeFactory.getByUserAndPeriod({uid: user2_id, pid: pid});
				time.$promise.then(function(data) {
					if (data.periods && data.periods[0].tasks.length > 0)
					{
						$scope.tasks = data.periods[0].tasks;
						$scope.tasks.time.length = 0;
					} else {
						$scope.tasks = null;
					}
				});
			};
		
			var period = PeriodsFactory.query();
			period.$promise.then(function(data) {
				$scope.periods = data;
				$scope.period = data[0];
				$scope.changePeriod();
			});
			
			$scope.changePeriod = function() {
				
			};
			
			$scope.isError = function(task) {
				return $scope.sumHoursTask(task) > task.authHours;
			}
			
			$scope.sumHoursDay = function(day) {
				var sum = 0.00;
				if ($scope.tasks)
				{
					$.each($scope.tasks, function(i, e) {
						sum += e.time[day];
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
				if ($scope.tasks)
				{
					$.each($scope.tasks, function(i, e) {
						sum += $scope.sumHoursTask(e);
					});
				}
				return sum;
			}
			
			$scope.sumAuthHours = function() {
				var sum = 0.00;
				if ($scope.tasks)
				{
					$.each($scope.tasks, function(i, e) {
						sum += e.authHours;
					});
				}
				return sum;
			}
			
			/*
			$scope.addAbsense = function() {
				if($scope.absense != undefined)
					$scope.time.push({ "taskId": $scope.absense.id, "taskName": $scope.absense.name, "taskDescription": $scope.absense.description, "time": [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0] });
				$('#addAbsenseModal').modal('hide');
			}
			
			$scope.addLabor = function() {
				if($scope.labor != undefined)
					$scope.time.push({ "taskId": $scope.labor.id, "taskName": $scope.labor.name, "taskDescription": $scope.labor.description, "time": [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0] });
				$('#addLaborModal').modal('hide');
			}*/
		}
	]);

	timeTracker.controller('testService', ['$scope', 'AbsensesFactory', 'AbsenseFactory',
		function($scope, AbsensesFactory, AbsenseFactory) {
			$scope.absenses = AbsensesFactory.query();
			
			$scope.changeSelected = function() {
				var a = AbsenseFactory.show({id: $scope.selectedId});
				a.$promise.then(function(data) {
					$scope.selected = data;
				});
			}
		}
	]);
}