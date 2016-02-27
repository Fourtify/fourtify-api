/**
 * Settings Mongo Schema
 * @auth deagan
 * @type {*|exports|module.exports}
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var settingsSchema = mongoose.Schema({
    provider: {
        type: Schema.ObjectId,
        ref: "providers"
    },
    //timeZone: new Date().getTimezoneOffset().toString,
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
    theme: {
        primaryColor: String,
        secondaryColor: String
    }
}, {
    id: true,
    collection: "settings"
});

settingsSchema.pre('save', function(next) {
    this.timeStamp.updated = new Date();
    next();
});



module.exports = mongoose.model('settings', settingsSchema);
