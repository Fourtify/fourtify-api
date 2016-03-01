"use strict";

var md5 = require("md5");

var Settings = require("./Settings");
var SettingsSchema = require("../schemas/settings");
var Error = require("../../errors/src/Error");

module.exports = class SettingsFactory {

    constructor() {
    }

    /**
     * Pass in providerId to create settings and save to that providerId
     * This is called from settings.js and are the new setting options
     *
     * TODO: NOT DONE, still adding dulplicates
     *
     * @param newObj - providerId, primaryColor, secondaryColor, logo, etc...
     * @param callback
     * @returns {*}
     */



    static createSettings(newObj, callback) {
        var newSettings = new SettingsSchema();


        console.log("newObj: "+JSON.stringify(newObj.provider));

        if (!newObj.provider) {
            return callback(new Error("PROVIDER004"));
        } else {
            newSettings.provider = newObj.provider;
        }


        newSettings.theme.primaryColor = "BBDEFB";
        newSettings.theme.secondaryColor = "2196F3";
        newSettings.logo = "http://get-logos.com/wp-content/uploads/2013/04/0008-cloudtech.jpg"; //place holder

        newSettings.timeZone = "America/New York";
        newSettings.status = newObj.status || "created";

        async.series([
                function(cb) {
                    //if (newObj.email) {
                        //check if settings already exists
                        SettingsSchema.findOne({
                            provider: newObj.provider

                        }).exec(function(err, foundSettings) {
                            console.log("foundSettings: "+JSON.stringify(foundSettings));
                            if (err) {
                                return cb(new Error("DBA002", err.message));
                            } else if (!foundSettings) {
                                return cb(new Error("EMPLOYEE007"));
                            } else {
                                return cb(null);
                            }
                        });
                    //} else {
                    //    cb(null);
                    //}
                }
            ],
            function(err, results) {
                if (err) {
                    return callback(err);
                } else {
                    newSettings.save(function(err, cbEmployee) {
                        if (err) {
                            callback(new Error("DBA001", err.message));
                        } else {
                            callback(null, new Settings(cbEmployee));
                        }
                    });
                }
            });
    };








/*

    static updateProvider(updateObj, callback) {
        ProvidersSchema.findById(updateObj.id).exec(function(err, provider) {
            if (err) {
                return callback(new Error("DBA003", err.message));
            } else if (!provider) {
                return callback(new Error("SIA003", updateObj.id));
            } else {
                if (updateObj.name) {
                    provider.name = updateObj.name;
                }
                if (updateObj.clientId) {
                    provider.clientId = updateObj.clientId;
                }
                if (updateObj.clientSecret) {
                    provider.clientSecret = updateObj.clientSecret;
                }
                if (updateObj.status) {
                    provider.status = updateObj.status;
                }

                provider.save(function(err, cbProvider) {
                    if (err) {
                        callback(new Error("DBA003", err.message));
                    } else {
                        callback(null, new Provider(cbProvider));
                    }
                });
            }
        });
    }*/

    static deleteSettings(settingId, callback) {
        SettingsSchema.findById(settingId).exec(function(err, setting) {

            if (err) {
                return callback(new Error("DBA004", err.message));
            } else if (!setting) {
                return callback(new Error("SIA003 (setting not found)", settingId));
            } else {
                setting.remove(function(err, cbSetting) {
                    if (err) {
                        callback(new Error("DBA004", err.message));
                    } else {
                        callback(null);
                    }
                });
            }
        });
    }



    static findSettingsById(params, callback) {

        var schemaQuery = SettingsSchema.find( {_id: params} );

        schemaQuery.exec(function(err, providers) {
            if (err) {
                callback(new Error("DBA002", err.message));
            } else {
                callback(null, providers.map(function(s) {
                    return new Settings(s);
                }));
            }
        });
    }



    /*
    static generateTimeHash(str) {
        var newStr = str + new Date().getTime() + Math.floor(Math.random() * 1000000);
        return md5(newStr);
    }*/




};
