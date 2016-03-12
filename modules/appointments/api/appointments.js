var express = require('express');
var router = express.Router();
var AuthMiddleware = require("../../authentication/src/AuthMiddleware");

var AppointmentFactory = require('../src/AppointmentFactory');
var Error = require("../../errors/src/Error");

// =========================================================================
// GET - /appointment/count
// =========================================================================
// Get the number of appointment for this provider.
router.get('/count', AuthMiddleware.authenticate(), function(req, res) {
    AppointmentFactory.getCount({
        provider: req.provider.id,
        search: req.query.search,
        visitor: req.query.visitor,
        status: req.query.status,
        start: req.query.start,
        end: req.query.end
    }, function(err, count) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(count);
        }
    });
});

// =========================================================================
// GET - /appointment
// =========================================================================
// Get appointment based on query parameters.
router.get('/', AuthMiddleware.authenticate(), function(req, res) {
    if (req.query.id) {
        AppointmentFactory.findAppointmentById({
            id: req.query.id,
            provider: req.provider.id
        }, function(err, data) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.status(200).send(data);
            }
        });
    } else {
        AppointmentFactory.findAppointment({
            provider: req.provider.id,
            include: req.query.include,
            exclude: req.query.exclude,
            paginate: req.query.paginate,
            perPage: req.query.perPage,
            page: req.query.page,
            sort: req.query.sort,
            sortBy: req.query.sortBy,
            search: req.query.search,
            visitor: req.query.visitor,
            status: req.query.status,
            start: req.query.start,
            end: req.query.end
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
// POST - /appointment
// =========================================================================
// Create a appointment
router.post('/', AuthMiddleware.authenticate(), function(req, res) {

    console.log(JSON.stringify("visitor: "+req.body.visitor));
    if (!req.provider) {
        return res.status(500).send(new Error("PROVIDER004"));
    }

    if (!req.body.visitor) {
        return res.status(500).send(new Error("APPOINTMENT001"));
    }

    AppointmentFactory.createAppointment({
        provider: req.provider.id,
        visitor: req.body.visitor,
        start: req.body.start,
        end: req.body.end,
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
// PUT - /appointment/:appointmentId
// =========================================================================
// Update appointment elements
router.put('/:appointmentId', AuthMiddleware.authenticate(), function(req, res) {

    if (!req.provider) {
        return res.status(500).send(new Error("PROVIDER004"));
    }

    if (!req.body.visitor) {
        return res.status(500).send(new Error("APPOINTMENT001"));
    }

    AppointmentFactory.updateAppointmentProfile({
        provider: req.provider.id,
        appointmentId: req.params.appointmentId,
        visitor: req.body.visitor,
        start: req.body.start,
        end: req.body.end,
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
// DELETE - /appointments/:appointmentId
// =========================================================================
// Delete a appointment.
router.delete('/:appointmentId', AuthMiddleware.authenticate(), function(req, res) {

    if (!req.provider) {
        return res.status(500).send(new Error("PROVIDER004"));
    }

    AppointmentFactory.deleteAppointment({
        provider: req.provider.id,
        appointmentId: req.params.appointmentId
    }, function(err) {
        if (err) {
            res.status(500).send(err);
        } else {
            //@todo transfer future records and write all past records to history
            res.status(200).end();
        }
    });
});

module.exports = router;
