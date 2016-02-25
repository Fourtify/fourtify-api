// load the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// define the schema for our queue model
var queueSchema = mongoose.Schema({
    provider: {
        type: Schema.ObjectId,
        ref: "providers"
    },
    visitor: {
        type: Schema.ObjectId,
        ref: "visitors"
    },
    appointment: {
        type: Schema.ObjectId,
        ref: "appointments"
    },
    timeStamp: {
        created: {
            type: Date,
            default: Date.now
        },
        updated: {
            type: Date,
            default: Date.now
        }
    },
    //TODO: order?
}, {
    id: true,
    collection: "queue"
});

queueSchema.pre('save', function(next) {
    this.timeStamp.updated = new Date();
    next();
});

// Methods
// -------

module.exports = mongoose.model('queue', queueSchema);