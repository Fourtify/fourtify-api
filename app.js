var dotenv = require('dotenv');
dotenv.load();
var environment = process.env.NODE_ENV;

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
var configDB = require('./config/database.json')[environment];

var app = express();

mongoose.connect(configDB.host, configDB.db, configDB.port,
    configDB.credentials,
    function(err) {
        if (err) {
            throw err;
        }
    });

app.use(logger('dev'));
app.use(bodyParser.json({
    limit: '50mb'
}));
app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true
}));
//@todo modules that we will be implementing
app.use('/settings', require('./modules/settings/api/settings.js'));
app.use('/providers', require('./modules/providers/api/providers.js'));
app.use('/authentication', require('./modules/authentication/api/authentication.js'));
app.use('/employees', require('./modules/employees/api/employees.js'));
app.use('/appointments', require('./modules/appointments/api/appointments.js'));
app.use('/queue', require('./modules/queue/api/queue.js'));
app.use('/queue/history', require('./modules/queue/api/queueHistory.js'));
app.use('/visitors', require('./modules/visitors/api/visitors.js'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.send(err);
        /*res.render('error', {
            message: err.message,
            error: err
        });*/
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.send(err);
    /*res.render('error', {
        message: err.message,
        error: {}
    });*/
});

module.exports = app;
