"use strict";

var md5 = require("md5");

var Site = require("./Site");
var SitesSchema = require("../schemas/sites");
var Error = require("../../errors/src/Error");

module.exports = class SiteFactory {

    constructor() {}

    //we pass in site of type Site and callback
    static createSite(newObj, callback) {
        var site = new SitesSchema();

        if (newObj.name) {
            site.name = newObj.name;
        } else {
            return callback(new Error("SIA001"));
        }
        if (newObj.clientId) {
            site.clientId = newObj.clientId;
        } else {
            return callback(new Error("SIA002"));
        }
        if (newObj.clientSecret) {
            site.clientSecret = newObj.clientSecret;
        } else {
            return callback(new Error("SIA002"));
        }
        site.status = newObj.status || "created";

        site.save(function(err, cbSite) {
            if (err) {
                callback(new Error("DBA001", err.message));
            } else {
                callback(null, new Site(cbSite));
            }
        });
    }

    static updateSite(updateObj, callback) {
        SitesSchema.findById(updateObj.id).exec(function(err, site) {
            if (err) {
                return callback(new Error("DBA003", err.message));
            } else if (!site) {
                return callback(new Error("SIA003", updateObj.id));
            } else {
                if (updateObj.name) {
                    site.name = updateObj.name;
                }
                if (updateObj.clientId) {
                    site.clientId = updateObj.clientId;
                }
                if (updateObj.clientSecret) {
                    site.clientSecret = updateObj.clientSecret;
                }
                if (updateObj.status) {
                    site.status = updateObj.status;
                }

                site.save(function(err, cbSite) {
                    if (err) {
                        callback(new Error("DBA003", err.message));
                    } else {
                        callback(null, new Site(cbSite));
                    }
                });
            }
        });
    }

    static deleteSite(siteId, callback) {
        SitesSchema.findById(siteId).exec(function(err, site) {
            if (err) {
                return callback(new Error("DBA004", err.message));
            } else if (!site) {
                return callback(new Error("SIA003", siteId));
            } else {
                site.remove(function(err, cbSite) {
                    if (err) {
                        callback(new Error("DBA004", err.message));
                    } else {
                        callback(null);
                    }
                });
            }
        });
    }

    static findSiteById(id, callback) {
        SitesSchema.findById(id).select("-clientSecret").exec(function(err, site) {
            if (err) {
                callback(new Error("DBA002", err.message));
            } else {
                callback(null, new Site(site));
            }
        });
    }

    static findSiteByClientIdSecret(obj, callback) {
        SitesSchema.findOne({
            clientId: obj.clientId,
            clientSecret: obj.clientSecret
        }).select("-clientSecret").exec(function(err, site) {
            if (err) {
                callback(new Error("DBA002", err.message));
            } else {
                callback(null, new Site(site));
            }
        });
    }

    static findSite(params, callback) {
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

        var schemaQuery = SitesSchema.find(query).select(select);

        if (paginate.paginate) {
            schemaQuery.limit(paginate.perPage).skip(paginate.perPage * (paginate.page - 1));
        }

        schemaQuery.sort(sort).exec(function(err, sites) {
            if (err) {
                callback(new Error("DBA002", err.message));
            } else {
                callback(null, sites.map(function(s) {
                    return new Site(s);
                }));
            }
        });
    }

    static generateTimeHash(str) {
        var newStr = str + new Date().getTime() + Math.floor(Math.random() * 1000000);
        return md5(newStr);
    }

};
