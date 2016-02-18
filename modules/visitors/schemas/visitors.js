var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    relationship = require('mongoose-relationship'),
    bcrypt = require('bcrypt-nodejs');

var visitorsSchema = mongoose.Schema ({
    provider: {
        type: Schema.ObjectId,
        ref: "providers"
    },
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
},{
    id:true,
    collection: "visitors"
});

visitorsSchema.pre('save', function(next) {
    this.timeStamp.updated = new Date();
    next();
});
