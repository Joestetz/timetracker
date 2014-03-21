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
	var scope, controllerSvc, httpMock;
	
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
	beforeEach(inject(function($rootScope, $controller, $httpBackend) {
		scope = $rootScope.$new();
		controllerSvc = $controller;
		httpMock = $httpBackend;
	}));
	
	describe('initial data call -- with time', function() {
		beforeEach(inject(function() {
			httpMock.whenGET('/api/periods').respond(mockApiResponsePeriod)
			httpMock.whenGET('/api/time?period=period1&user=52f78c914293916d8c8c281b').respond(mockApiResponseTime)
			ctrl = controllerSvc('enterTimeController', {$scope: scope});
			httpMock.flush();
		}));
		
		it('should query for period and time', function() {
			httpMock.expectGET('/api/periods');
			httpMock.expectGET('/api/time?period=period1&user=52f78c914293916d8c8c281b');
			ctrl = controllerSvc('enterTimeController', {$scope: scope});
			httpMock.flush();
		});
		
		it('should set $scope.periods and $scope.period from period response', function() {
			expect(JSON.stringify(scope.periods)).toEqual(JSON.stringify(mockApiResponsePeriod));
			expect(JSON.stringify(scope.period)).toEqual(JSON.stringify(mockApiResponsePeriod[0]));
		});
		
		it('should set $scope.periodTasks and $scope.timeId from time response', function() {
			expect(scope.periodTasks).toEqual(mockApiResponseTime.tasks);
			expect(scope.timeId).toEqual(mockApiResponseTime._id);
		});
	});
	
	describe('initial data call -- without time', function() {
		beforeEach(inject(function() {
			httpMock.whenGET('/api/periods').respond(mockApiResponsePeriod)
			httpMock.whenGET('/api/time?period=period1&user=52f78c914293916d8c8c281b').respond(mockApiResponseTimeEmpty)
			httpMock.whenGET('/api/time?period=period2&user=52f78c914293916d8c8c281b').respond(mockApiResponseTime)
			ctrl = controllerSvc('enterTimeController', {$scope: scope});
			httpMock.flush();
		}));
		
		it('should query for period and time, with time being called twice', function() {
			httpMock.expectGET('/api/periods');
			httpMock.expectGET('/api/time?period=period1&user=52f78c914293916d8c8c281b');
			httpMock.expectGET('/api/time?period=period2&user=52f78c914293916d8c8c281b');
			ctrl = controllerSvc('enterTimeController', {$scope: scope});
			httpMock.flush();
		});
		
		it('should clear all $scope.periodTasks time and authHour entries', function() {
			expect(scope.periodTasks[0].time.length).toBe(0);
			expect(scope.periodTasks[0].authHours).toEqual(null);
		});
	});
	
	describe('user driven events', function() {			
		beforeEach(inject(function() {
			httpMock.whenGET('/api/periods').respond(mockApiResponsePeriod)
			httpMock.whenGET('/api/time?period=period1&user=52f78c914293916d8c8c281b').respond(mockApiResponseTime)
			ctrl = controllerSvc('enterTimeController', {$scope: scope});
			httpMock.flush();
		}));
		
		describe('selected period changes', function(){	
			beforeEach(inject(function() {
				scope.period._id = 'changedPeriodId';
				spyOn(scope, 'changePeriod').andCallThrough();
				scope.changePeriod();
			}));
		
			it('should fetch new data when selected period changes', function() {
				httpMock.expectGET('/api/time?period=changedPeriodId&user=52f78c914293916d8c8c281b').respond(200);
				ctrl = controllerSvc('enterTimeController', {$scope: scope});
				httpMock.flush();
			});
			
			it('should call changePeriod', function() {
				expect(scope.changePeriod).toHaveBeenCalled();
			});
		});
		
		// describe('save time', function() {
			// beforeEach(inject(function() {
			// }));
			
			// it('should fetch new data', function() {
			// });
		// });
		
		describe('user submits time', function() {
			it('should alert user of not being implemented yet', function() {
				var alert_msg;
				spyOn(window, 'alert').andCallFake(function(msg) {
					alert_msg = msg;
				});
				
				spyOn(scope, 'submitTime').andCallThrough();
				scope.submitTime();
				
				expect(scope.submitTime).toHaveBeenCalled();
				expect(alert_msg).toBe("Not implemented.");
			});
		});
		
		// describe('delete time', function() {
		// });
	});
	
	describe('page-load calculations', function() {
		beforeEach(inject(function() {
			httpMock.whenGET('/api/periods').respond(mockApiResponsePeriod)
			httpMock.whenGET('/api/time?period=period1&user=52f78c914293916d8c8c281b').respond(mockApiResponseTime)
			ctrl = controllerSvc('enterTimeController', {$scope: scope});
			httpMock.flush();
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
});