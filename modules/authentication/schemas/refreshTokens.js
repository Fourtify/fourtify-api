// load the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// define the schema for our refreshTokens model
var refreshTokensSchema = mongoose.Schema({
    value: String,
    employee: {
        type: Schema.Types.ObjectId,
        ref: "employee"
    },
    expires: {
        type: Date,
        expires: 0
    },
    provider: {
        type: Schema.Types.ObjectId,
        ref: "provider"
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
    }
}, {
    id: true,
    collection: "refreshTokens"
});

refreshTokensSchema.pre('save', function(next) {
    this.timeStamp.updated = new Date();
    next();
});

// create the model for users and expose it to our app
module.exports = mongoose.model('refreshTokens', refreshTokensSchema);
