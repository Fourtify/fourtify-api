var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var providersSchema = mongoose.Schema({

    name: String,
    clientId: String,
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
    collection: "providers"
});

providersSchema.pre('save', function(next) {
    this.timeStamp.updated = new Date();
    next();
});



module.exports = mongoose.model('providers', providersSchema);