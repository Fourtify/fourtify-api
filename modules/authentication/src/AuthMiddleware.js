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

        return function(req, res, next) {

            var byToken = undefined;
            var byApp = undefined; //allowing authenticate bypass by app -- not the most secure method, but will work for now.

            var clientId;
            var clientSecret;

            var headerToken = req.get('Authorization');

            // Header: http://tools.ietf.org/html/rfc6750#section-2.1
            if (headerToken) {
                byToken = headerToken.match(/Bearer\s(\S+)/);
                byApp = headerToken.match(/Basic\s(\S+)/);

                if (!byToken && !byApp) {
                    return res.status(500).send(new Error("AUA015"));
                }
                else if(byToken){
                    headerToken = byToken[1];
                }
                else if(byApp){
                    var auth = new Buffer(byApp[1], 'base64').toString();
                    auth = auth.match(/^([^:]+):(.+)$/);
                    if (!auth) {
                        return res.status(500).send(new Error("AUA003"));
                    }
                    clientId = auth[1];
                    clientSecret = auth[2];
                }


            }

            if(byToken){
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

            }
            else if(byApp){
                providersSchema.findOne({
                    clientId: clientId,
                    clientSecret: clientSecret
                }, function(err, provider) {
                    if (err) {
                        return res.status(500).send(new Error("DBA002", err.message));
                    } else if (!provider) {
                        return res.status(500).send(new Error("PROVIDER003", clientId));
                    }
                    else {
                        req.provider = new Provider(provider);
                        next();
                    }
                });
            }


        };
    }

};
