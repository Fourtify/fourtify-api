/**
 * Created by Jon on 2/17/2016.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    relationship = require('mongoose-relationship');

var appointmentsSchema = mongoose.Schema({
    provider: {
        type: Schema.ObjectId,
        ref: "providers"
    },
    visitor: {
        type: Schema.ObjectId,
        ref: "visitors"
    },
    status: String,
    start: Date,
    end: Date,
    timeStamp: {
        created: {
            type: Date,
            default: Date.now
        },
        updated: {
            type: Date,
            default: Date.now
        }
    }
}, {
    id: true,
    collection: "appointments"
});

appointmentsSchema.pre('save', function(next) {
    this.timeStamp.updated = new Date();
    next();
});

module.exports = mongoose.model('appointments', appointmentsSchema);