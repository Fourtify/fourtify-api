"use strict";
var express = require('express');
var crypto = require('crypto');
var moment = require('moment');
var router = express.Router();

var ProviderFactory = require('../src/ProviderFactory');
var EmployeeFactory = require('../../employees/src/EmployeeFactory');
var Error = require("../../errors/src/Error");
var AuthMiddleware = require("../../authentication/src/AuthMiddleware");

// =========================================================================
// GET - /providers
// =========================================================================
// Get providers based on query parameters. If id is passed in, 1 result is returned, otherwise an array is returned
//@todo, authenticate the app, not the user
router.get('/', /*AuthMiddleware.authenticate(),*/ function(req, res) {
    if (req.query.id) {
        ProviderFactory.findProviderById(req.query.id, function(err, data) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.status(200).send(data);
            }
        });
    }
    else if (req.query.domain) {
        ProviderFactory.findProviderByDomain(req.query.domain, function(err, data) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.status(200).send(data);
            }
        });
    }else {
        ProviderFactory.findProvider({
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
// POST - /providers
// =========================================================================
// Creates a new provider
router.post('/', function(req, res) {


    console.log("in provider: "+JSON.stringify(req.body));

    if (!req.body.provider.name) {
        return res.status(500).send(new Error("PROVIDER001"));
    }
    var clientId = ProviderFactory.generateTimeHash(req.body.name);


    ProviderFactory.createProvider({
        name: req.body.provider.name,
        domain: req.body.provider.domain,
        clientId: clientId,
        clientSecret: ProviderFactory.generateTimeHash(clientId),
        status: req.body.status
    }, function(err, data) {
        if (err) {
            res.status(500).send(err);
        } else {
            EmployeeFactory.createEmployee({
                provider: data._id,
                name: req.body.employee.name,
                title: req.body.employee.title,
                email: req.body.employee.email,
                password: req.body.employee.password,
                phone: req.body.employee.phone,
                status: req.body.employee.status
            }, function(err, data2) {
                if (err) {
                    ProviderFactory.deleteProvider(data._id, function(err) {
                    });
                    res.status(500).send(err);
                } else {
                    res.status(200).send({
                        provider: data,
                        employee: data2
                    });
                }
            });
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
