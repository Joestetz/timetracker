describe('headerController test', function() {
	var rootScope, scope, ctrl, location;
	
	beforeEach(module('timeTracker'));
	beforeEach(inject(function($rootScope, $controller, $location) {
		rootScope = $rootScope;
		scope = $rootScope.$new();
		location = $location;
		ctrl = $controller('headerController', {$scope: scope, $location: location});
	}));

	it('should have isActive as true for the active page', function() {
		// using spyOn
		spyOn(location, 'path').andReturn('/tasks');
		expect(location.path()).toBe('/tasks');
		expect(scope.isActive('/tasks')).toBe(true);
	});
	
	it('should have isActive as false for the inactive pages', function() {
		// without using spyOn
		location.path('/tasks');
		rootScope.$apply();
		expect(location.path()).toBe('/tasks');
		expect(scope.isActive('/time')).toBe(false);
	});
});

describe('enterTimeController', function() {
	var rootScope, scope, ctrl, api, $q, mockApi;
	
	var mockApiResponsePeriod = [
		{
			"_id": "period1",
			"title": "June 2013 P1",
			"startDate": "2013-06-01T04:00:00.000Z",
			"endDate": "2013-06-15T04:00:00.000Z",
			"days": 15
		},
		{
			"_id": "period2",
			"title": "June 2013 P2",
			"startDate": "2013-06-16T04:00:00.000Z",
			"endDate": "2013-06-30T04:00:00.000Z",
			"days": 15
		}
	];
		
	var mockApiResponseTime = {
		"_id": "time1",
		"user_id": "user1",
		"period_id": "period2",
		"tasks": [
			{
				"isAbsense": false,
				"task_id": "task0",
				"taskName": "Task Name 00",
				"taskDescription": "Description 00",
				"uid": "B01000000000000000000",
				"authHours": 40,
				"time": [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2]
			},{
				"isAbsense": false,
				"task_id": "task1",
				"taskName": "Task Name 01",
				"taskDescription": "Description 01",
				"uid": "B01000000000000000001",
				"authHours": 25,
				"time": [3,3,2.5,2,3,2,2,3,2,0,2,2,0,2,1.25]
			}
		]
	}
		
	var mockApiResponseTimeEmpty = {
		"_id": "time1",
		"user_id": "user1",
		"period_id": "period2",
		"tasks": []
	}
	
	beforeEach(module('timeTracker'));
	beforeEach(inject(function($rootScope, $controller, _$q_) {
		rootScope = $rootScope;
		scope = $rootScope.$new();
		$q = _$q_;
		
		mockApi = {
			call: function(route) {
				return {
					getAll: function() {
						getAllDeferred = $q.defer();
						return {$promise: getAllDeferred.promise};
					},
					getOneByParams: function() {
						getOneByParamsDeferred = $q.defer();
						return {$promise: getOneByParamsDeferred.promise};
					}
				};
			}
		}
		
		spyOn(mockApi, 'call').andCallThrough();
		ctrl = $controller('enterTimeController', {$scope: scope, Api: mockApi});
	}));
	
	describe('initial data call -- with time', function() {
		beforeEach(inject(function() {
			getAllDeferred.resolve(angular.copy(mockApiResponsePeriod));
			rootScope.$apply();
			getOneByParamsDeferred.resolve(angular.copy(mockApiResponseTime));
			rootScope.$apply();
		}));
		
		it('should query for periods', function() {
			expect(mockApi.call).toHaveBeenCalledWith('/api/periods');
			expect(mockApi.call.callCount).toBe(2);
		});
		
		it('should set $scope.periods and $scope.period from period response', function() {
			expect(scope.periods).toEqual(mockApiResponsePeriod);
			expect(scope.period).toEqual(mockApiResponsePeriod[0]);
		});
		
		it('should query for time', function() {
			expect(mockApi.call).toHaveBeenCalledWith('/api/time');
			expect(mockApi.call.callCount).toBe(2);
		});
		
		it('should set $scope.periodTasks and $scope.timeId from time response', function() {
			expect(scope.periodTasks).toEqual(mockApiResponseTime.tasks);
			expect(scope.timeId).toEqual(mockApiResponseTime._id);
		});
	});
	
	describe('initial data call -- without time', function() {
		beforeEach(inject(function() {
			getAllDeferred.resolve(angular.copy(mockApiResponsePeriod));
			rootScope.$apply();
			getOneByParamsDeferred.resolve(angular.copy(mockApiResponseTimeEmpty));
			rootScope.$apply();
			getOneByParamsDeferred.resolve(angular.copy(mockApiResponseTime));
			rootScope.$apply();
		}));
		
		it('should query for time twice', function() {
			expect(mockApi.call).toHaveBeenCalledWith('/api/time');
			expect(mockApi.call.callCount).toBe(3);
		});
		
		it('should clear all $scope.periodTasks time and authHour entries', function() {
			expect(scope.periodTasks[0].time.length).toBe(0);
			expect(scope.periodTasks[0].authHours).toEqual(null);
		});
	});
	
	describe('user driven events', function() {			
		beforeEach(inject(function() {
		}));
		
		describe('selected period changes', function(){
			beforeEach(inject(function() {
				getAllDeferred.resolve(angular.copy(mockApiResponsePeriod));
				rootScope.$apply();
				getOneByParamsDeferred.resolve(angular.copy(mockApiResponseTime));
				rootScope.$apply();
				
				spyOn(scope, 'changePeriod').andCallThrough();
				scope.changePeriod();
			}));
			
			it('should call changePeriod', function() {
				expect(scope.changePeriod).toHaveBeenCalled();
			});
		
			it('should fetch new data when selected period changes', function() {
				expect(mockApi.call).toHaveBeenCalledWith('/api/time');
				expect(mockApi.call.callCount).toBe(3);
			});
		});
	});
	
	describe('page-load calculations', function() {
		beforeEach(inject(function() {
			getAllDeferred.resolve(angular.copy(mockApiResponsePeriod));
			rootScope.$apply();
			getOneByParamsDeferred.resolve(angular.copy(mockApiResponseTime));
			rootScope.$apply();
		}));
		
		it('should properly sum the hours for a given day', function() {
			spyOn(scope, 'sumHoursDay').andCallThrough();
			var result = scope.sumHoursDay(1);
			
			expect(scope.sumHoursDay).toHaveBeenCalled();
			expect(result).toBe(5);
		});
		
		it('should sum the hours for a given task', function() {
			spyOn(scope, 'sumHoursTask').andCallThrough();
			var result1 = scope.sumHoursTask(mockApiResponseTime.tasks[0]);
			var result2 = scope.sumHoursTask(mockApiResponseTime.tasks[1]);
			
			expect(scope.sumHoursTask.callCount).toBe(2);
			expect(result1).toBe(30);
			expect(result2).toBe(29.75);
		});
		
		it('should sum the total hours for all tasks in a given period', function() {
			spyOn(scope, 'sumTotalHours').andCallThrough();
			var result = scope.sumTotalHours();
			
			expect(scope.sumTotalHours).toHaveBeenCalled();
			expect(result).toBe(59.75);
		});
		
		it('should sum the total authorized hours for all tasks in a given period', function() {
			spyOn(scope, 'sumAuthHours').andCallThrough();
			var result = scope.sumAuthHours();
			
			expect(scope.sumAuthHours).toHaveBeenCalled();
			expect(result).toBe(65);
		});
	});
	
	// it('should make an update call when saved', function() {
	// });
	
	// it('should alert the user when time is submitted', function() {
	// });
	
	// it('should delete a task from the given period when prompted', function() {
	// });
});