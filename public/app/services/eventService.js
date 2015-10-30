angular.module('eventService', [])

.factory('Event', function($http) {
    var eventFactory = {};

    eventFactory.all = function() {
        return $http.get('/api/events/');
    };

    eventFactory.create = function(eventData) {
        return $http.post('/api/events/', eventData);
    };

    eventFactory.update = function(id, eventData) {
        return $http.put('/api/events/' + id, eventData);
    };

    eventFactory.delete = function(id) {
        return $http.delete('/api/events/' + id);
    };

    // add, get, and delete participants

    return eventFactory;
});