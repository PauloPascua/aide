var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var eventSchema = new Schema({
    name: String,
    description: String,
    date: Date
});

var Event = mongoose.model('Event', eventSchema);
module.exports = Event;