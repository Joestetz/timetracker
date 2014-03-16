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
	}));
	
	describe('initial data call -- with time', function() {
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
			}];
			
		var mockApiResponseTime = {
			"_id": "time1",
			"user_id": "user1",
			"period_id": "period2",
			"tasks": [
				{
					"isAbsense": false,
					"task_id": "52f78dcf4293916d8c8c281d",
					"taskName": "Task Name 00",
					"taskDescription": "Description 00",
					"uid": "B01000000000000000000",
					"authHours": 40,
					"time": [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2]
				}]
			}
			
		beforeEach(inject(function($controller) {
			spyOn(mockApi, 'call').andCallThrough();
			ctrl = $controller('enterTimeController', {$scope: scope, Api: mockApi});
		
			getAllDeferred.resolve(mockApiResponsePeriod);
			rootScope.$apply();
			getOneByParamsDeferred.resolve(mockApiResponseTime);
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
			}];
		
		var mockApiResponseTimeFirst = {
			"_id": "time1",
			"user_id": "user1",
			"period_id": "period2",
			"tasks": []
			}
			
		var mockApiResponseTimeSecond = {
			"_id": "time1",
			"user_id": "user1",
			"period_id": "period1",
			"tasks": [
				{
					"isAbsense": false,
					"task_id": "52f78dcf4293916d8c8c281d",
					"taskName": "Task Name 00",
					"taskDescription": "Description 00",
					"uid": "B01000000000000000000",
					"authHours": 40,
					"time": [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2]
				}]
			}
			
		beforeEach(inject(function($controller) {
			spyOn(mockApi, 'call').andCallThrough();
			ctrl = $controller('enterTimeController', {$scope: scope, Api: mockApi});
		
			getAllDeferred.resolve(mockApiResponsePeriod);
			rootScope.$apply();
			getOneByParamsDeferred.resolve(mockApiResponseTimeFirst);
			rootScope.$apply();
			getOneByParamsDeferred.resolve(mockApiResponseTimeSecond);
			rootScope.$apply();
		}));
		
		it('should query for time twice', function() {
			expect(mockApi.call).toHaveBeenCalledWith('/api/time');
			expect(mockApi.call.callCount).toBe(3);
		});
		
		it('should set $scope.periodTasks and $scope.timeId from time response', function() {
			expect(scope.periodTasks).toEqual(mockApiResponseTimeSecond.tasks);
			expect(scope.timeId).toEqual(mockApiResponseTimeSecond._id);
		});
		
		it('should clear all $scope.periodTasks time and authHour entries', function() {
			expect(scope.periodTasks[0].time.length).toBe(0);
			expect(scope.periodTasks[0].authHours).toEqual(null);
		});
	});
	
	describe('user driven events', function() {
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
			}];
			
		var mockApiResponseTime = {
			"_id": "time1",
			"user_id": "user1",
			"period_id": "period2",
			"tasks": [
				{
					"isAbsense": false,
					"task_id": "52f78dcf4293916d8c8c281d",
					"taskName": "Task Name 00",
					"taskDescription": "Description 00",
					"uid": "B01000000000000000000",
					"authHours": 40,
					"time": [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2]
				}]
			}
			
		beforeEach(inject(function($controller) {
			spyOn(mockApi, 'call').andCallThrough();
			ctrl = $controller('enterTimeController', {$scope: scope, Api: mockApi});
		
			getAllDeferred.resolve(mockApiResponsePeriod);
			rootScope.$apply();
			getOneByParamsDeferred.resolve(mockApiResponseTime);
			rootScope.$apply();
		}));
		
		describe('selected period changes', function(){
			beforeEach(inject(function() {
				scope.period = {_id: '123'};
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
	
	// it('should properly sum the hours for a given day', function() {
	// });
	
	// it('should sum the hours for a given task', function() {
	// });
	
	// it('should sum the total hours for all tasks in a given period', function() {
	// });
	
	// it('should sum the total authorized hours for all tasks in a given period', function() {
	// });
	
	// it('should make an update call when saved', function() {
	// });
	
	// it('should alert the user when time is submitted', function() {
	// });
	
	// it('should delete a task from the given period when prompted', function() {
	// });
});