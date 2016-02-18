var express = require('express');
var moment = require('moment');
var router = express.Router();

var AppointmentFactory = require('../src/AppointmentFactory');
var Error = require("../../errors/src/Error");
var AuthMiddleware = require("../../authentication/src/AuthMiddleware");

// =========================================================================
// GET - /appointments
// =========================================================================
// Get appointments based on query parameters.
router.get('/', AuthMiddleware.authenticate(), function(req, res) {
    if (req.query.id) {
        AppointmentFactory.findAppointmentById(req.query.id, function(err, data) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.status(200).send(data);
            }
        });
    } else {
        AppointmentFactory.findAppointment({
            include: req.query.include,
            exclude: req.query.exclude,
            paginate: req.query.paginate,
            perPage: req.query.perPage,
            page: req.query.page,
            sortBy: req.query.sortBy,
            search: req.query.search,
            status: req.query.status
        }, function(err, data) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.status(200).send(data);
            }
        });
    }
});


// =========================================================================
// POST - /appointments
// =========================================================================
// Creates a new appointment
router.post('/', function(req, res) {

    if (!req.body.name) {
        return res.status(500).send(new Error("APPOINTMENT001"));
    }
    var clientId = AppointmentFactory.generateTimeHash(req.body.name);

    ProviderFactory.createProvider({
        name: req.body.name,
        clientId: clientId,
        clientSecret: ProviderFactory.generateTimeHash(clientId),
        status: req.body.status
    }, function(err, data) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(data);
        }
    });
});

// =========================================================================
// PUT - /providers
// =========================================================================
// Updates a provider
router.put('/:providerId', function(req, res) {

    ProviderFactory.updateProvider({
        id: req.params.providerId,
        name: req.body.name,
        clientId: req.body.clientId,
        clientSecret: req.body.clientSecret,
        status: req.body.status
    }, function(err, data) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(data);
        }
    });
});

// =========================================================================
// DELETE - /providers
// =========================================================================
// deletes a provider
router.put('/:providerId', function(req, res) {
    ProviderFactory.deleteProvider(req.params.providerId, function(err) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).end();
        }
    });
});




module.exports = router;
/** appointments api goes here **/