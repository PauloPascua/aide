var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var eventSchema = new Schema({
    name: String,
    description: String,
    date: Date,
    time: {
        fromTime: Date, 
        toTime: Date
    },
    venue: String,
    participants: [{
        type: Schema.Types.ObjectId,
        ref: 'users'
    }],
    host: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    tags: [String]
});

var Event = mongoose.model('Event', eventSchema);
module.exports = Event;