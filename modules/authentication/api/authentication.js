var express = require('express');
var router = express.Router();

var requestIp = require('request-ip');
var async = require('async');

var Error = require("../../errors/src/Error");

var Provider = require('../../providers/src/Provider');
var ProviderFactory = require('../../providers/src/ProviderFactory');
var AccessToken= require('../src/AccessToken');
var AuthenticationFactory = require('../src/AuthenticationFactory');
var EmployeeFactory = require('../../employees/src/EmployeeFactory');
var Employee = require('../../employees/src/Employee');


// =========================================================================
// POST - /authentication/token
// =========================================================================
// Retrieves a token from the oauth server
router.post('/token', function(req, res) {

    // Only POST via application/x-www-form-urlencoded is acceptable
    if (req.method !== 'POST' ||
        !req.is('application/x-www-form-urlencoded')) {
        return res.status(500).send(new Error("AUA001"));
    }

    // Grant type
    var grantType = req.body.grant_type;
    if (!grantType || (grantType != "password" && grantType != "refresh_token")) {
        return res.status(500).send(new Error("AUA002"));
    }

    //client id and client secret
    var auth = req.headers.authorization;
    if (!auth) {
        return res.status(500).send(new Error("AUA003"));
    }

    // malformed
    var parts = auth.split(' ');
    if ('basic' != parts[0].toLowerCase() || !parts[1]) {
        return res.status(500).send(new Error("AUA003"));
    }
    auth = parts[1];

    // credentials
    auth = new Buffer(auth, 'base64').toString();
    auth = auth.match(/^([^:]+):(.+)$/);
    if (!auth) {
        return res.status(500).send(new Error("AUA003"));
    }
    var clientId = auth[1];
    var clientSecret = auth[2];

    //check and find site
    EmployeeFactory.findSiteByClientIdSecret({
        clientId: clientId,
        clientSecret: clientSecret
    }, function(err, data) {
        if (err) {
            res.status(500).send(err);
        } else {
            var provider = data; //provider is instanceof Provider

            //check and split on grant type
            if (grantType == "password") {
                async.waterfall([
                        function(callback) {
                            EmployeeFactory.authenticate({
                                provider: provider.id,
                                email: req.body.email,
                                password: req.body.password
                            }, function(err, employee) {
                                if (err) {
                                    callback(err);
                                } else {
                                    callback(null, employee);
                                }
                            });
                        },
                        function(employee, callback) {
                            AuthenticationFactory.createAccessToken({
                                employee: employee.id,
                                provider: provider.id
                            }, function(err, accessToken) {
                                if (err) {
                                    callback(err);
                                } else {
                                    callback(null, employee, accessToken);
                                }
                            });
                        },
                        function(employee, accessToken, callback) {
                            AuthenticationFactory.createRefreshToken({
                                employee: employee.id,
                                provider: provider.id
                            }, function(err, refreshToken) {
                                if (err) {
                                    callback(err);
                                } else {
                                    callback(null, employee, accessToken, refreshToken);
                                }
                            });
                        }
                    ],
                    // optional callback
                    function(err, employee, accessToken, refreshToken) {
                        // the results array will equal ['one','two'] even though
                        // the second function had a shorter timeout.
                        if (err) {
                            res.status(500).send(err);
                        } else {
                            res.status(200).send({
                                accessToken: {
                                    _value: accessToken.value,
                                    _expires: accessToken.expires
                                },
                                refreshToken: {
                                    _value: refreshToken.value,
                                    _expires: refreshToken.expires
                                },
                                provider: provider,
                                employee: employee
                            });
                        }
                    });
            } else if (grantType == "refresh_token") {
                //check refresh token
                AuthenticationFactory.createAccessTokenFromRefresh({
                    value: req.body.refresh_token,
                    provider: provider.id
                }, function(err, accessToken) {
                    if (err) {
                        res.status(500).send(err);
                    } else {
                        EmployeeFactory.findById({
                            id: accessToken.employee.id,
                            provider: provider.id
                        }, function(err, employee) {
                            res.status(200).send({
                                accessToken: {
                                    _value: accessToken.value,
                                    _expires: accessToken.expires
                                },
                                provider: provider,
                                employee: employee
                            });
                        });
                    }
                });
            }
        }
    });
});

// =========================================================================
// GET - /authentication/logout ============================================================
// =========================================================================
// Log user out
router.get('/logout', function(req, res) {
    //@todo destroy all access and refresh tokens for that user on the site
});

module.exports = router;
