"use strict";
var crypto = require('crypto');
var moment = require('moment');
var AccessToken = require("./AccessToken");
var RefreshToken = require("./RefreshToken");
var AuthenticationFactory = require("./AuthenticationFactory");
var accessTokensSchema = require("../schemas/accessTokens");
var refreshTokensSchema = require("../schemas/refreshTokens");
var providersSchema = require('../../providers/schemas/providers');
var Error = require("../../errors/src/Error");


module.exports = class AuthenticationFactory {

    constructor() {}

    static generateToken(callback) {
        crypto.randomBytes(256, function(ex, buffer) {
            if (ex) {
                return callback(new Error("AUA005"));
            }
            var token = crypto
                .createHash('sha1')
                .update(buffer)
                .digest('hex');

            callback(null, token);
        });
    }

    static createAccessToken(tokenObj, callback) {
        var accessToken = new accessTokensSchema();

        if (tokenObj.employee) {
            accessToken.employee = tokenObj.employee;
        } else {
            return callback(new Error("AUA006"));
        }
        if (tokenObj.provider) {
            accessToken.provider = tokenObj.provider;
        } else {
            return callback(new Error("AUA008"));
        }

        var expires = new Date();
        expires.setSeconds(expires.getSeconds() + AuthenticationFactory.getAccessTokenLifeTime());

        accessToken.expires = expires;

        AuthenticationFactory.generateToken(function(err, token) {
            if (err) {
                callback(err);
            } else {
                accessToken.value = token;
                accessToken.save(function(err, cbToken) {
                    if (err) {
                        callback(new Error("DBA001", err.message));
                    } else {
                        callback(null, new AccessToken(cbToken));
                    }
                });
            }
        });
    }


    static createRefreshToken(tokenObj, callback) {
        var refreshToken = new refreshTokensSchema();

        if (tokenObj.employee) {
            refreshToken.employee = tokenObj.employee;
        } else {
            return callback(new Error("AUA006"));
        }
        if (tokenObj.provider) {
            refreshToken.provider = tokenObj.provider;
        } else {
            return callback(new Error("AUA008"));
        }

        var expires = new Date();
        expires.setSeconds(expires.getSeconds() + AuthenticationFactory.getRefreshTokenLifeTime());

        refreshToken.expires = expires;

        AuthenticationFactory.generateToken(function(err, token) {
            if (err) {
                callback(err);
            } else {
                refreshToken.value = token;
                refreshToken.save(function(err, cbToken) {
                    if (err) {
                        callback(new Error("DBA001", err.message));
                    } else {
                        callback(null, new RefreshToken(cbToken));
                    }
                });
            }
        });
    }

    static createAccessTokenFromRefresh(tokenObj, callback) {
        var accessToken = new accessTokensSchema();

        if (!tokenObj.value) {
            return callback(new Error("AUA011"));
        }
        if (tokenObj.provider) {
            accessToken.provider = tokenObj.provider;
        } else {
            return callback(new Error("AUA008"));
        }

        var expires = new Date();
        expires.setSeconds(expires.getSeconds() + AuthenticationFactory.getAccessTokenLifeTime());

        accessToken.expires = expires;

        //check refresh token
        refreshTokensSchema.findOne({
            value: tokenObj.value
        }).exec(function(err, refreshToken) {
            if (err) {
                callback(new Error("DBA002", err.message));
            } else if (!refreshToken) {
                callback(new Error("AUA012"));
            }
            //refresh token expired
            else if (moment(refreshToken.expires).isBefore(moment()) || moment(refreshToken.expires).isSame(moment())) {
                callback(new Error("AUA013"));
            }
            else {
                accessToken.employee = refreshToken.employee;
                AuthenticationFactory.generateToken(function(err, token) {
                    if (err) {
                        callback(err);
                    } else {
                        accessToken.value = token;
                        accessToken.save(function(err, cbToken) {
                            if (err) {
                                callback(new Error("DBA001", err.message));
                            } else {
                                callback(null, new AccessToken(cbToken));
                            }
                        });
                    }
                });
            }
        });

    }


    static getAccessTokenLifeTime() {
        return 3600;
    }

    static getRefreshTokenLifeTime() {
        return 1209600;
    }

};
