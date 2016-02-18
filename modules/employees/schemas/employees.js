var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    relationship = require('mongoose-relationship'),
    bcrypt = require('bcrypt-nodejs');

var employeesSchema = mongoose.Schema({
    provider: {
        type: Schema.ObjectId,
        ref: "providers"
    },
    name: {
        first: String,
        last: String
    },
    title: String,
    email: String,
    password: String,
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
}, {
    id: true,
    collection: "employees"
});

employeesSchema.pre('save', function(next) {
    this.timeStamp.updated = new Date();
    next();
});

// Methods
// -------
// Generate a hash
employeesSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// Generate a temporary password (input is length of password)
employeesSchema.methods.generateTemporaryPassword = function(length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
};

// Check if password is valid
employeesSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password.value);
};

module.exports = mongoose.model('employees', employeesSchema);