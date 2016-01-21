"use strict";
var express = require('express');
var crypto = require('crypto');
var moment = require('moment');
var router = express.Router();

var SiteFactory = require('../src/SiteFactory');
var Error = require("../../errors/src/Error");
var AuthMiddleware = require("../../authentication/src/AuthMiddleware");

// *************************************************************************
// **************************** Public Methods *****************************
// *************************************************************************

// =========================================================================
// GET - /sites
// =========================================================================
// Get sites based on query parameters. If id is passed in, 1 result is returned, otherwise an array is returned
router.get('/', AuthMiddleware.authenticate(), function(req, res) {
    if (req.query.id) {
        SiteFactory.findSiteById(req.query.id, function(err, data) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.status(200).send(data);
            }
        });
    } else {
        SiteFactory.findSite({
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
// POST - /sites
// =========================================================================
// Creates a new site
router.post('/', function(req, res) {

    if (!req.body.name) {
        return res.status(500).send(new Error("SIA001"));
    }
    var clientId = SiteFactory.generateTimeHash(req.body.name);

    SiteFactory.createSite({
        name: req.body.name,
        clientId: clientId,
        clientSecret: SiteFactory.generateTimeHash(clientId),
        status: req.body.status
    }, function(err, data) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).end();
        }
    });
});

// =========================================================================
// PUT - /sites
// =========================================================================
// Updates a site
router.put('/:siteId', function(req, res) {

    SiteFactory.updateSite({
        id: req.params.siteId,
        name: req.body.name,
        clientId: req.body.clientId,
        clientSecret: req.body.clientSecret,
        status: req.body.status
    }, function(err, data) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).end();
        }
    });
});

// =========================================================================
// DELETE - /sites
// =========================================================================
// deletes a site
router.put('/:siteId', function(req, res) {
    SiteFactory.deleteSite(req.params.siteId, function(err) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).end();
        }
    });
});




module.exports = router;
