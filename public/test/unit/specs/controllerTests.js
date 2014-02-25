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