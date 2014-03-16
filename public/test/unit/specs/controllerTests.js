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
						deferred = $q.defer();
						return {$promise: deferred.promise};
					}
				};
			}
		}
		
		spyOn(mockApi, 'call').andCallThrough();
	
		ctrl = $controller('enterTimeController', {$scope: scope, Api: mockApi});
	}));
	
	it('should make a call to get time periods', function() {
		queryDeferred.resolve(mockBagelsResponse);
		$rootScope.$apply();
		expect(mockBagelApiService.query).toHaveBeenCalled();
	});
	
	it('should make a call to get time for a given period', function() {
	});
	
	it('should fetch new data when selected period changes', function() {
	});
	
	it('should properly sum the hours for a given day', function() {
	});
	
	it('should sum the hours for a given task', function() {
	});
	
	it('should sum the total hours for all tasks in a given period', function() {
	});
	
	it('should sum the total authorized hours for all tasks in a given period', function() {
	});
	
	it('should make an update call when saved', function() {
	});
	
	it('should alert the user when time is submitted', function() {
	});
	
	it('should delete a task from the given period when prompted', function() {
	});
});