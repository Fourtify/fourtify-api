"use strict";

var md5 = require("md5");

var Provider = require("./Provider");
var ProvidersSchema = require("../schemas/providers");
var Error = require("../../errors/src/Error");

module.exports = class ProviderFactory {

    constructor() {}

    //we pass in provider of type Provider and callback
    static createProvider(newObj, callback) {
        var newProvider = new ProvidersSchema();

        if (newObj.name) {
            newProvider.name = newObj.name;
        } else {
            return callback(new Error("PROVIDER001"));
        }
        if (newObj.domain) {
            newProvider.domain = newObj.domain.toLowerCase();
        } else {
            return callback(new Error("PROVIDER006"));
        }
        if (newObj.clientId) {
            newProvider.clientId = newObj.clientId;
        } else {
            return callback(new Error("PROVIDER002"));
        }
        if (newObj.clientSecret) {
            newProvider.clientSecret = newObj.clientSecret;
        } else {
            return callback(new Error("PROVIDER002"));
        }
        newProvider.status = newObj.status || "created";

        ProvidersSchema.findOne({domain: newObj.domain}).exec(function(err, provider) {
            if (err) {
                return callback(new Error("DBA003", err.message));
            } else if (provider) {
                return callback(new Error("PROVIDER005", newObj.domain));
            } else {
                newProvider.save(function(err, cbProvider) {
                    if (err) {
                        callback(new Error("DBA001", err.message));
                    } else {
                        callback(null, new Provider(cbProvider));
                    }
                });
            }
        });

    }

    static updateProvider(updateObj, callback) {
        ProvidersSchema.findById(updateObj.id).exec(function(err, provider) {
            if (err) {
                return callback(new Error("DBA003", err.message));
            } else if (!provider) {
                return callback(new Error("PROVIDER003", updateObj.id));
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
                return callback(new Error("PROVIDER003", providerId));
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

    /**
     * Find provider with clientId
     * @param id
     * @param callback
     */
    static findProviderById(id, callback) {
        ProvidersSchema.findById(id).select("-clientSecret").exec(function(err, provider) {
            if (err) {
                callback(new Error("DBA002", err.message));
            } else if(!provider){
                callback(new Error("PROVIDER003", id));
            }
            else {
                callback(null, new Provider(provider));
            }
        });
    }

    static findProviderByDomain(domain, callback) {
        ProvidersSchema.findOne({domain:domain.toLowerCase()}).exec(function(err, provider) {
            if (err) {
                callback(new Error("DBA002", err.message));
            } else if(!provider){
                callback(new Error("PROVIDER007", domain));
            }
            else {
                callback(null, new Provider(provider));
            }
        });
    }

    static findProviderByClientIdSecret(obj, callback) {
        ProvidersSchema.findOne({
            clientId: obj.clientId,
            clientSecret: obj.clientSecret
        }).select("-clientSecret").exec(function(err, provider) {
            if (err) {
                callback(new Error("DBA002", err.message));
            }
            else if(!provider){
                callback(new Error("PROVIDER003", obj));
            }
            else {
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

        var schemaQuery = ProvidersSchema.find(query).select(select);

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

};
