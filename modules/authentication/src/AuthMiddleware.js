"use strict";
var crypto = require('crypto');
var moment = require('moment');
var AccessToken= require("./AccessToken");
var RefreshToken = require("./RefreshToken");
var AuthenticationFactory = require("./AuthenticationFactory");
var accessTokensSchema = require("../schemas/accessTokens");
var refreshTokensSchema = require("../schemas/refreshTokens");
var providersSchema = require('../../providers/schemas/providers');
var Error = require("../../errors/src/Error");
var Provider = require("../../providers/src/Provider");


module.exports = class AuthMiddleware {

    constructor() {}

    static authenticate() {
        //temporary method to allow everything to pass for demo purposes;
        return function(req, res, next) {
            next();
        };

    }
    static authenticateActual() {
        /*if (typeof options == 'string') {
            options = { redirectTo: options }
        }
        options = options || {};

        var url = options.redirectTo || '/login';
        var setReturnTo = (options.setReturnTo === undefined) ? true : options.setReturnTo;*/

        return function(req, res, next) {

            var headerToken = req.get('Authorization');

            // Header: http://tools.ietf.org/html/rfc6750#section-2.1
            if (headerToken) {
                var matches = headerToken.match(/Bearer\s(\S+)/);

                if (!matches) {
                    return res.status(500).send(new Error("AUA015"));
                }

                headerToken = matches[1];
            }

            accessTokensSchema.findOne({
                value: headerToken
            }, function(err, token) {
                if (err) {
                    return res.status(500).send(new Error("DBA002", err.message));
                } else if (!token) {
                    return res.status(500).send(new Error("AUA016"));
                }
                //access token expired
                else if (moment(token.expires).isBefore(moment()) || moment(token.expires).isSame(moment())) {
                    return res.status(500).send(new Error("AUA017"));
                }
                else {
                    //@todo check if the token is meant for this particular provider

                    req.provider = new Provider(token.provider);
                    next();
                }
            });

        };
    }

};
