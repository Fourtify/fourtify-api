"use strict";
var express = require('express');
var crypto = require('crypto');
var moment = require('moment');
var router = express.Router();

var SettingsFactory = require('../src/SettingsFactory');
var Error = require("../../errors/src/Error");
var AuthMiddleware = require("../../authentication/src/AuthMiddleware");

// =========================================================================
// GET - /settings
// =========================================================================
// Get settings based on query parameters. If id is passed in, 1 result is returned, otherwise an array is returned
router.get('/', AuthMiddleware.authenticate(), function(req, res) {
    res.status(200).send("test");
    if (req.query.id) {
        SettingsFactory.findSettingsById(req.query.id, function(err, data) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.status(200).send(data);
            }
        });
    } else {
        SettingsFactory.findSettings({
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
// POST - /settings
// =========================================================================
// Creates settings for provider - Should be called on provider created
router.post('/', function(req, res) {


    if (!req.body.providerId) {
        return res.status(500).send(new Error("PROVIDER001"));
    }

    //var settingsId = SettingsFactory.generateTimeHash(req.body.providerId);
    //res.status(200).send(settingsId);

    //TODO create settings and save


    SettingsFactory.createSettings({
        providerId: req.body.providerId,
        primaryColor: "#0288D1",
        secondaryColor: "#03A9F4"
        //,logo: reg.body.logoUrl


    }, function(err, data) {

        if (err) {
            console.log("err: "+JSON.stringify(err));
            res.status(500).send(err);
        } else {
            console.log("data: "+JSON.stringify(data));
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
router.delete('/:providerId', function(req, res) {
    ProviderFactory.deleteProvider(req.params.providerId, function(err) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).end();
        }
    });
});




module.exports = router;
