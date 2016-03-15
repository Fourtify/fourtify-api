"use strict";

var async = require("async");

var Settings = require("./Settings"),
    SettingsSchema = require("../schemas/settings"),
    Error = require("../../errors/src/Error");

module.exports = class SettingsFactory {

    constructor() {}

    //we pass in query Obj and callback
    static getCount(queryObj, callback) {

        var query = {
            provider: queryObj.provider
        };
        if (queryObj.search) {
            query = {
                provider: {
                    $regex: new RegExp(queryObj.search, "i")
                }
            };
        }
        
        if (queryObj.timezone) {
            query.timezone = queryObj.timezone;
        }
        if (queryObj.logo) {
            query.logo = queryObj.logo;
        }
        if (queryObj.slack) {
            query.slack = queryObj.slack;
        }
        if (queryObj.theme) {
            query.theme = queryObj.theme;
        }
        SettingsSchema.count(query, function(err, count) {
            if (err) {
                callback(new Error("DBA002", err.message));
            } else {
                callback(null, {count:count});
            }
        });
    };

    //we pass in new Obj Site and callback
    static createSettings(newObj, callback) {
        var newSettings = new SettingsSchema();

        if (!newObj.provider) {
            return callback(new Error("PROVIDER004"));
        } else {
            newSettings.provider = newObj.provider;
        }
    

        newSettings.timezone = newObj.timezone;
        newSettings.logo = newObj.logo;
        newSettings.slack = newObj.slack;
        newSettings.theme = newObj.theme;

        newSettings.save(function(err, cbSettings) {
            if (err) {
                callback(new Error("DBA001", err.message));
            } else {
                callback(null, new Settings(cbSettings));
            }
        });
    };

    static updateSettings(updateObj, callback) {
        if (!updateObj.provider) {
            return callback(new Error("PROVIDER004"));
        }
        
        SettingsSchema.findOne({
            provider: updateObj.provider
        }).exec(function(err, settings) {
            if (err) {
                callback(new Error("DBA003", err.message));
            } else if (!settings) {
                SettingsFactory.createSettings(updateObj, callback);
                //callback(new Error("SETTINGS002", updateObj.settingsId));
            } else {
                if (updateObj.timezone) {
                    settings.timezone = updateObj.timezone;
                }
                if (updateObj.logo) {
                    settings.logo = updateObj.logo;
                }
                if (updateObj.slack) {
                    settings.slack = updateObj.slack;
                }
                if (updateObj.theme) {
                    settings.theme = updateObj.theme;
                }


                settings.save(function(err, cbSettings) {
                    if (err) {
                        callback(new Error("DBA003", err.message));
                    } else {
                        callback(null, new Settings(cbSettings));
                    }
                });
            }
        });
    };



    static deleteSettings(deleteObj, callback) {
        if (!deleteObj.provider) {
            return callback(new Error("PROVIDER004"));
        }

        SettingsSchema.findOne({
            provider: deleteObj.provider,
            _id: deleteObj.settingsId
        }).exec(function(err, settings) {
            if (err) {
                callback(new Error("DBA004", err.message));
            } else if (!settings) {
                callback(new Error("SETTINGS002", deleteObj.settingsId));
            } else {
                settings.remove(function(err) {
                    if (err) {
                        callback(new Error("DBA004", err.message));
                    } else {
                        callback(null);
                    }
                });
            }
        });
    };


    static findSettingsById(params, callback) {
        if (!params.provider) {
            return callback(new Error("PROVIDER004"));
        }

        SettingsSchema.findOne({
            _id: params.id,
            provider: params.provider
        }).exec(function(err, settings) {
            if (err) {
                callback(new Error("DBA002", err.message));
            } else if (!settings) {
                callback(new Error("SETTINGS002", params.id));
            } else {
                callback(null, new Settings(settings));
            }
        });
    };

    static findSettings(params, callback) {
        if (!params.provider) {
            return callback(new Error("PROVIDER004"));
        }

        var select = {};
        if (params.include) {
            var include = params.include.split(",");
            for (var i = 0; i < include.length; i++) {
                select[include[i]] = 1;
            }
        } else if (params.exclude) {
            var exclude = params.exclude.split(",");
            for (var j = 0; j < exclude.length; j++) {
                select[exclude[j]] = 0;
            }
        } else {
            select = {
                provider: 1,
                theme: 1,
                timezone: 1,
                logo: 1,
                slack: 1
            };
        }

        var query = {
            provider: params.provider
        };

        if (params.search) {
            query = {
                "provider": {
                    $regex: new RegExp(params.search, "i")
                }
            };
        }

        if (params.timezone) {
            query.timezone = params.timezone;
        }
        if (params.logo) {
            query.logo = params.logo;
        }
        if (params.slack) {
            query.slack = params.slack;
        }
        if (params.theme) {
            query.theme = params.theme;
        }

        var schemaQuery = SettingsSchema.findOne(query);

        schemaQuery.exec(function(err, settings) {
            if (err) {
                callback(new Error("DBA002", err.message));
            } else {
                callback(null, new Settings(settings));
            }
        });
    };

};
