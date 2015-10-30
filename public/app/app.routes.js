angular.module('app.routes', ['ngRoute'])

.config(function($routeProvider, $locationProvider) {

	$routeProvider

		// route for the home page
		.when('/', {
			templateUrl : 'app/views/pages/home.html'
		})
		
		// login page
		.when('/login', {
			templateUrl : 'app/views/pages/login.html',
   			controller  : 'mainController',
    		controllerAs: 'login'
		})

		.when('/signup', {
			templateUrl : 'app/views/pages/signup.html',
			controller  : 'mainController',
			controllerAs: 'signup'
		})
		
		// show all users
		.when('/users', {
			templateUrl: 'app/views/pages/users/allUsers.html',
			controller: 'userController',
			controllerAs: 'user'
		})

		// form to create a new user
		// same view as edit page
		.when('/users/create', {
			templateUrl: 'app/views/pages/users/editsingle.html',
			controller: 'userCreateController',
			controllerAs: 'userCreateCtrl'
		})

		// page to edit a user
		.when('/users/:user_id', {
			templateUrl: 'app/views/pages/users/editsingle.html',
			controller: 'userEditController',
			controllerAs: 'user'
		})

		.when('/u/:user_username', {
			templateUrl: 'app/views/pages/users/viewuser.html',
			controller: 'userViewController',
			controllerAs: 'user'
		})

		.when('/events', {
			templateUrl: 'app/views/pages/events/allEvents.html',
			controller: 'eventController',
			controllerAs: 'eventCtrl'
		})

		.when('/events/create', {
			templateUrl: 'app/views/pages/events/createEvent.html',
			controller: 'eventCreateController',
			controllerAs: 'eventCreateCtrl'
		})

		.when('/events/:event_id', {
			templateUrl: 'app/views/pages/events/viewEvent.html',
			controller: 'eventViewController',
			controllerAs: 'eventViewCtrl'
		});

		// participants' page

	$locationProvider.html5Mode(true);

});