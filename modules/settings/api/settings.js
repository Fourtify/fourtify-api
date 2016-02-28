"use strict";
var express = require('express');
var crypto = require('crypto');
var moment = require('moment');
var router = express.Router();

var SettingsSchema = require('../schemas/settings');
var SettingsFactory = require('../src/SettingsFactory');
var Error = require("../../errors/src/Error");
var AuthMiddleware = require("../../authentication/src/AuthMiddleware");

// =========================================================================
// GET - /settings
// =========================================================================
// Get settings based on query parameters. If id is passed in, 1 result is returned, otherwise an array is returned
router.get('/', AuthMiddleware.authenticate(), function(req, res) {

    console.log("query.id: " +req.query.id);

    if (req.query.id) {
        SettingsFactory.findSettings(req.query.id, function(err, data) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.status(200).send(data);
            }
        });
    } else
        res.status(500).send("Missing settings Id.");

});


// =========================================================================
// POST - /settings
// =========================================================================
// Creates settings for provider - Should be called on provider created
router.post('/', function(req, res) {


    console.log(JSON.stringify(req.body));

    if (!req.body.providerId) {
        return res.status(500).send(new Error("PROVIDER001"));
    }




    SettingsFactory.createSettings({
        providerId: req.body.providerId
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
// DELETE - /settings
// =========================================================================
// deletes a setting by settingId, not providerId
router.delete('/:settingId', function(req, res) {
    console.log("req.params.settingId: " + req.params.settingId);
    SettingsFactory.deleteSettings(req.params.settingId, function(err) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).end();
        }
    });
});




module.exports = router;
