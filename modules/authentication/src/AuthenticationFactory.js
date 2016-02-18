"use strict";
var crypto = require('crypto');
var moment = require('moment');
var AccessTokenStaff = require("./AccessToken");
var RefreshTokenStaff = require("./RefreshToken");
var AuthenticationFactory = require("./AuthenticationFactory");
var accessTokensStaffSchema = require("../schemas/accessTokens");
var refreshTokensStaffSchema = require("../schemas/refreshTokens");
var accessTokensCustomersSchema = require("../schemas/accessTokensCustomers");
var SitesSchema = require('../../sites/schemas/sites');
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

    static createAccessTokenStaff(tokenObj, callback) {
        var accessTokenStaff = new accessTokensStaffSchema();

        if (tokenObj.staff) {
            accessTokenStaff.staff = tokenObj.staff;
        } else {
            return callback(new Error("AUA006"));
        }
        if (tokenObj.site) {
            accessTokenStaff.site = tokenObj.site;
        } else {
            return callback(new Error("AUA008"));
        }
        if (tokenObj.userAgent) {
            accessTokenStaff.userAgent = tokenObj.userAgent;
        } else {
            return callback(new Error("AUA009"));
        }
        if (tokenObj.ip) {
            accessTokenStaff.ip = tokenObj.ip;
        } else {
            return callback(new Error("AUA010"));
        }

        var expires = new Date();
        expires.setSeconds(expires.getSeconds() + AuthenticationFactory.getAccessTokenLifeTime());

        accessTokenStaff.expires = expires;

        AuthenticationFactory.generateToken(function(err, token) {
            if (err) {
                callback(err);
            } else {
                accessTokenStaff.value = token;
                accessTokenStaff.save(function(err, cbToken) {
                    if (err) {
                        callback(new Error("DBA001", err.message));
                    } else {
                        callback(null, new AccessTokenStaff(cbToken));
                    }
                });
            }
        });
    }


    static createRefreshTokenStaff(tokenObj, callback) {
        var refreshTokenStaff = new refreshTokensStaffSchema();

        if (tokenObj.staff) {
            refreshTokenStaff.staff = tokenObj.staff;
        } else {
            return callback(new Error("AUA006"));
        }
        if (tokenObj.site) {
            refreshTokenStaff.site = tokenObj.site;
        } else {
            return callback(new Error("AUA008"));
        }
        if (tokenObj.userAgent) {
            refreshTokenStaff.userAgent = tokenObj.userAgent;
        } else {
            return callback(new Error("AUA009"));
        }
        if (tokenObj.ip) {
            refreshTokenStaff.ip = tokenObj.ip;
        } else {
            return callback(new Error("AUA010"));
        }

        var expires = new Date();
        expires.setSeconds(expires.getSeconds() + AuthenticationFactory.getRefreshTokenLifeTime());

        refreshTokenStaff.expires = expires;

        AuthenticationFactory.generateToken(function(err, token) {
            if (err) {
                callback(err);
            } else {
                refreshTokenStaff.value = token;
                refreshTokenStaff.save(function(err, cbToken) {
                    if (err) {
                        callback(new Error("DBA001", err.message));
                    } else {
                        callback(null, new RefreshTokenStaff(cbToken));
                    }
                });
            }
        });
    }

    static createAccessTokenFromRefreshStaff(tokenObj, callback) {
        var accessTokenStaff = new accessTokensStaffSchema();

        if (!tokenObj.value) {
            return callback(new Error("AUA011"));
        }
        if (tokenObj.site) {
            accessTokenStaff.site = tokenObj.site;
        } else {
            return callback(new Error("AUA008"));
        }
        if (tokenObj.userAgent) {
            accessTokenStaff.userAgent = tokenObj.userAgent;
        } else {
            return callback(new Error("AUA009"));
        }
        if (tokenObj.ip) {
            accessTokenStaff.ip = tokenObj.ip;
        } else {
            return callback(new Error("AUA010"));
        }

        var expires = new Date();
        expires.setSeconds(expires.getSeconds() + AuthenticationFactory.getAccessTokenLifeTime());

        accessTokenStaff.expires = expires;

        //check refresh token
        refreshTokensStaffSchema.findOne({
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
            //unable to validate refresh token
            else if (tokenObj.userAgent != refreshToken.userAgent || tokenObj.ip != refreshToken.ip ||
                String(tokenObj.site) != String(refreshToken.site)) {
                callback(new Error("AUA014"));
            } else {
                accessTokenStaff.staff = refreshToken.staff;
                AuthenticationFactory.generateToken(function(err, token) {
                    if (err) {
                        callback(err);
                    } else {
                        accessTokenStaff.value = token;
                        accessTokenStaff.save(function(err, cbToken) {
                            if (err) {
                                callback(new Error("DBA001", err.message));
                            } else {
                                callback(null, new AccessTokenStaff(cbToken));
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
