angular.module('eventCtrl', ['eventService'])

.controller('eventController', function(Event) {
    var vm = this;
    vm.processing = true;

    // retrieve all events on load
    Event.all()
        .success(function(data) {
            vm.processing = false;
            vm.eventsData = data;
        });
})

.controller('eventCreateController', function(Event) {
    var vm = this;
    vm.type = 'create';

    vm.saveEvent = function() {
        vm.processing = true;
        vm.message = '';

        // access create method in eventService
        Event.create(vm.eventData)
            .success(function(data) {
                
                vm.processing = false;
                vm.eventData = {};
                vm.message = data.message;

                // $location.path('/events');
            });
    };

})

.controller('eventViewController', function($routeParams, Event, Auth) {
    var vm = this;
    vm.message = $routeParams.event_id;

    Event.get($routeParams.event_id).success(function(data) {
        vm.eventData = data;
        vm.message = data;
    });

    vm.processing = true;

    // get events' participants

    vm.processing = false;

    // add participants to the event
});