"use strict";

var md5 = require("md5");

var Settings = require("./Settings");
var SettingsSchema = require("../schemas/settings");
var Error = require("../../errors/src/Error");

var ProviderFactory = require("../../providers/src/ProviderFactory");
var ProvidersSchema = require("../../providers/schemas/providers");

module.exports = class ProviderFactory {

    constructor() {}

    /**
     * Pass in providerId to create settings and save to that providerId
     * This is called from settings.js and are the new setting options
     *
     * @param newObj - providerId, primaryColor, secondaryColor, logo, etc...
     * @param callback
     * @returns {*}
     */
    static createSettings(newObj, callback) {

        console.log("newObj: "+newObj.providerId+"...."+JSON.stringify(newObj));

        //callback("createSettings callback");


        /**
         * Find provider associated with given Id
         * @type {Promise|Array|{index: number, input: string}}
         */
        var thisProvider = ProvidersSchema.findById(newObj.providerId).select("clientId").exec(function(err, provider) {
            if (err) {
                console.log("error find provider: "+JSON.stringify(provider));
                callback(new Error("DBA002", err.message));
            } else {
                console.log("found: "+JSON.stringify(provider));
            }
        });



        var settings = new SettingsSchema();



        settings.save(function(err, cbProvider) {
            if (err) {
                callback(new Error("DBA001", err.message));
            } else {
                callback(null, new Settings(cbProvider));
            }
        });



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
    }

    static deleteProvider(providerId, callback) {
        ProvidersSchema.findById(providerId).exec(function(err, provider) {
            if (err) {
                return callback(new Error("DBA004", err.message));
            } else if (!provider) {
                return callback(new Error("SIA003", providerId));
            } else {
                provider.remove(function(err, cbProvider) {
                    if (err) {
                        callback(new Error("DBA004", err.message));
                    } else {
                        callback(null);
                    }
                });
            }
        });
    }

    static findSettingsById(id, callback) {
        SettingsSchema.findById(id).select("-clientSecret").exec(function(err, provider) {
            if (err) {
                callback(new Error("DBA002", err.message));
            } else {
                callback(null, new Provider(provider));
            }
        });
    }

    static findProviderByClientIdSecret(obj, callback) {
        SettingsSchema.findOne({
            clientId: obj.clientId,
            clientSecret: obj.clientSecret
        }).select("-clientSecret").exec(function(err, provider) {
            if (err) {
                callback(new Error("DBA002", err.message));
            } else {
                callback(null, new Provider(provider));
            }
        });
    }

    static findProvider(params, callback) {
        var select = {};
        if (params.include) {
            var include = params.include.split(",");
            for (var i = 0; i < include.length && include[i] != "clientSecret"; i++) {
                select[include[i]] = 1;
            }
        } else if (params.exclude) {
            var exclude = params.exclude.split(",");
            for (var j = 0; j < exclude.length; j++) {
                select[exclude[j]] = 0;
            }
        } else {
            select = {
                name: 1,
                status: 1
            };
        }

        var query = {};
        var paginate = {};
        var sort = {};
        paginate.paginate = params.paginate != "false";
        paginate.perPage = params.perPage ? params.perPage : 20;
        paginate.page = params.page ? params.page : 1;
        sort[params.sortBy ? params.sortBy : "name"] = params.sort == -1 ? -1 : 1;

        if (params.search) {
            query = {
                name: {
                    $regex: new RegExp(params.search, "i")
                }
            };
        }
        if (params.status) {
            query.status = params.status;
        }

        var schemaQuery = SettingsSchema.find(query).select(select);

        if (paginate.paginate) {
            schemaQuery.limit(paginate.perPage).skip(paginate.perPage * (paginate.page - 1));
        }

        schemaQuery.sort(sort).exec(function(err, providers) {
            if (err) {
                callback(new Error("DBA002", err.message));
            } else {
                callback(null, providers.map(function(s) {
                    return new Provider(s);
                }));
            }
        });
    }

    static generateTimeHash(str) {
        var newStr = str + new Date().getTime() + Math.floor(Math.random() * 1000000);
        return md5(newStr);
    }
*/



};
