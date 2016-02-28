"use strict";

var md5 = require("md5");

var Settings = require("./Settings");
var SettingsSchema = require("../schemas/settings");
var Error = require("../../errors/src/Error");

module.exports = class ProviderFactory {

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

        console.log(JSON.stringify(newObj));

        SettingsSchema.findById({providerId : newObj}).exec(function(err, settingRet) {


            if (err) {
                return callback(new Error("DBA003", err.message));
            } else if (!settingRet) {
                //NOT FOUND

                var setting = new SettingsSchema();

                setting.theme.primaryColor = "BBDEFB";
                setting.theme.secondaryColor = "2196F3";
                setting.logo = "http://get-logos.com/wp-content/uploads/2013/04/0008-cloudtech.jpg"; //place holder
                setting.provider = newObj.providerId;
                setting.timeZone = "America/New York";


                setting.save(function (err, cbSetting) {
                    if (err) {
                        callback(new Error("Error saving", err));
                    } else {
                        console.log("setting saved: " + cbSetting);
                        callback(null, new Settings(cbSetting));
                    }
                });

                //return callback(new Error("SIA003", newObj.id));
            } else {
                //FOUND

                return callback(null, "done");


            }
        });




/*

        //does setting exist? provider: newObj.providerId
        var schemaQuery = SettingsSchema.find( { provider: "56c675d8777d8d0d14fac96b" } );

        schemaQuery.exec(function (err, providers) {

            console.log("providers: " + JSON.stringify(newObj));

            if (err) {
                console.log("in error, no entry: "+ newObj.providerId);
                var setting = new SettingsSchema();

                setting.theme.primaryColor = "BBDEFB";
                setting.theme.secondaryColor = "2196F3";
                setting.logo = "http://get-logos.com/wp-content/uploads/2013/04/0008-cloudtech.jpg"; //place holder
                setting.provider = newObj.providerId;
                setting.timeZone = "America/New York";


                setting.save(function (err, cbSetting) {
                    if (err) {
                        callback(new Error("Error saving", err));
                    } else {
                        console.log("setting saved: " + cbSetting);
                        callback(null, new Settings(cbSetting));
                    }
                });


            } else {
                console.log("found setting: " + JSON.stringify(providers));
                callback(null, providers);
            }
        });


*/

/*
        SettingsSchema.findById( { id: newObj.providerId } ).exec(function(err, setting) {
            console.log("setting: "+JSON.stringify(setting));
            if (err) {
                return callback(new Error("DBA003", err.message));
            } else if (!setting) {
                return callback(new Error("SIA003", newObj.providerId));
            } else {
                console.log("newObj: "+JSON.stringify(newObj));
                console.log("setting: "+JSON.stringify(setting));

                if (newObj.name) {
                    setting.name = newObj.name;
                }
                if (newObj.clientId) {
                    setting.clientId = newObj.clientId;
                }
                if (newObj.clientSecret) {
                    setting.clientSecret = newObj.clientSecret;
                }
                if (newObj.status) {
                    setting.status = newObj.status;
                }

                setting.primaryColor = "#BBDEFB";
                setting.secondaryColor = "#2196F3";

                setting.save(function(err, cbProvider) {
                    if (err) {
                        //(new Error("DBA003", err.message));
                    } else {
                        //callback(null, new Provider(cbProvider));
                    }
                });
            }
        });
*/

        /**
         * Find provider associated with given Id
         * @type {Promise|Array|{index: number, input: string}}
         */

/*
        var thisSettings = SettingsSchema.find( {providerId: newObj.providerId} ).exec(function(err, settingsResult) {
            console.log("err: "+JSON.stringify(err));
            console.log("found: "+JSON.stringify(settingsResult));
            if (err) {
                console.log("error find settings: "+JSON.stringify(settingsResult));
                callback(new Error("DBA002", err.message));
            } else {
                console.log("found: "+JSON.stringify(settingsResult));

            }
        });


*/

        //var settings = new SettingsSchema();


        /**
         * Save new settings object into db
         */
        /*
        settings.save(function(err, cbProvider) {
            if (err) {
                callback(new Error("DBA001", err.message));
            } else {
                callback(null, new Settings(cbProvider));
            }
        });
*/

    }




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



    static findSettings(params, callback) {

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
