// load the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// define the schema for our user model
var sitesSchema = mongoose.Schema({
    name: String,
    clientId: {
        type: String,
        index: {
            unique: true
        }
    },
    clientSecret: String,
    status: String,
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
    collection: "sites"
});

sitesSchema.pre('save', function(next) {
    this.timeStamp.updated = new Date();
    next();
});

// create the model for sites and expose it to our app
module.exports = mongoose.model('sites', sitesSchema);
