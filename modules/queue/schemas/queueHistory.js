// load the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// define the schema for our queueHistory model
var queueHistorySchema = mongoose.Schema({
    provider: {
        type: Schema.ObjectId,
        ref: "providers"
    },
    providerObj:{
        name: String
    },
    visitor: {
        name: {
            first: String,
            last: String
        },
        email: String,
        phone: {
            type: {
                type: String
            },
            number: String
        },
        status: String
    },
    appointment: {
        status: String,
        start: Date,
        end: Date
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
    position: Number
}, {
    id: true,
    collection: "queueHistory"
});

queueHistorySchema.pre('save', function(next) {
    this.timeStamp.updated = new Date();
    next();
});

// Methods
// -------

module.exports = mongoose.model('queueHistory', queueHistorySchema);