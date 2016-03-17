"use strict";

var async = require("async");

var Visitor = require("./Visitor"),
    VisitorSchema = require("../schemas/visitors"),
    Error = require("../../errors/src/Error");

module.exports = class VisitorFactory {

    constructor() {}

    //we pass in query Obj and callback
    static getCount(queryObj, callback) {

        var query = {
            provider: queryObj.provider
        };
        if (queryObj.search) {
            query = {
                email: {
                    $regex: new RegExp(queryObj.search, "i")
                }
            };
        }
        if (queryObj.name) {
            query = {
                "name.first": {
                    $regex: new RegExp(queryObj.name.first, "i")
                }
            };
        }
        if (queryObj.email) {
            query = {
                "email": {
                    $regex: new RegExp(queryObj.email, "i")
                }
            };
        }
        if (queryObj.status) {
            query.status = queryObj.status;
        }
        VisitorSchema.count(query, function(err, count) {
            if (err) {
                callback(new Error("DBA002", err.message));
            } else {
                callback(null, {count:count});
            }
        });
    };

    //we pass in new Obj Site and callback
    //Need: Provider, Name
    static createVisitor(newObj, callback) {
        var newVisitor = new VisitorSchema();

        if (!newObj.provider) {
            return callback(new Error("PROVIDER004"));
        } else {
            newVisitor.provider = newObj.provider;
        }

        console.log("newObj.name: "+newObj.name);
        console.log("newObj.name.first: "+newObj.name.first);
        console.log("newObj.name.last: "+newObj.name.last);

        if (newObj.name) {
            newVisitor.name = newObj.name;
        } else {
            return callback(new Error("VISITOR001"));
        }
        
        newVisitor.email = newObj.email;
        newVisitor.phone = newObj.phone;
        newVisitor.status = newObj.status || "created";

        async.series([
                function(cb) {
                    if (newObj.email) {
                        //check if e mail already exists
                        VisitorSchema.findOne({
                            provider: newObj.provider,
                            email: newObj.email
                        }).exec(function(err, foundVisitor) {
                            if (err) {
                                return cb(new Error("DBA002", err.message));
                            } else if (foundVisitor) {
                                return cb(new Error("VISITOR007"));
                            } else {
                                return cb(null);
                            }
                        });
                    } else {
                        cb(null);
                    }
                }
            ],
            function(err, results) {
                if (err) {
                    return callback(err);
                } else {
                    newVisitor.save(function(err, cbVisitor) {
                        if (err) {
                            callback(new Error("DBA001", err.message));
                        } else {
                            callback(null, new Visitor(cbVisitor));
                        }
                    });
                }
            });
    };

    static updateVisitor(updateObj, callback) {
        if (!updateObj.provider) {
            return callback(new Error("PROVIDER004"));
        }
        if (!updateObj.name) {
            return callback(new Error("VISITOR001"));
        }
        VisitorSchema.findOne({
            provider: updateObj.provider,
            _id: updateObj.visitorId
        }).exec(function(err, visitor) {
            if (err) {
                callback(new Error("DBA003", err.message));
            } else if (!visitor) {
                callback(new Error("VISITOR002", updateObj.visitorId));
            } else {
                if (updateObj.name) {
                    visitor.name = updateObj.name;
                }
                if (updateObj.phone) {
                    visitor.phone = updateObj.phone;
                }
                if (updateObj.status) {
                    visitor.status = updateObj.status;
                }

                async.series([
                        function(cb) {
                            if (updateObj.email) {
                                visitor.email = updateObj.email;
                                if (updateObj.email != visitor.email) {
                                    //check if e mail already exists
                                    VisitorSchema.findOne({
                                        provider: updateObj.provider,
                                        email: updateObj.email
                                    }).exec(function(err, foundVisitor) {
                                        if (err) {
                                            cb(new Error("DBA002", err.message));
                                        } else if (foundVisitor) {
                                            return cb(new Error("VISITOR007"));
                                        } else {
                                            return cb(null);
                                        }
                                    });
                                } else {
                                    return cb(null);
                                }
                            } else {
                                return cb(null);
                            }

                        }
                    ],
                    function(err, results) {
                        if (err) {
                            return callback(err);
                        } else {
                            visitor.save(function(err, cbVisitor) {
                                if (err) {
                                    callback(new Error("DBA003", err.message));
                                } else {
                                    callback(null, new Visitor(cbVisitor));
                                }
                            });
                        }
                    });
            }
        });
    };


    static deleteVisitor(deleteObj, callback) {
        if (!deleteObj.provider) {
            return callback(new Error("PROVIDER004"));
        }

        VisitorSchema.findOne({
            provider: deleteObj.provider,
            _id: deleteObj.visitorId
        }).exec(function(err, visitor) {
            if (err) {
                callback(new Error("DBA004", err.message));
            } else if (!visitor) {
                callback(new Error("VISITOR002", deleteObj.visitorId));
            } else {
                visitor.remove(function(err) {
                    if (err) {
                        callback(new Error("DBA004", err.message));
                    } else {
                        callback(null);
                    }
                });
            }
        });
    };

    static findVisitorById(params, callback) {
        if (!params.provider) {
            return callback(new Error("PROVIDER004"));
        }

        VisitorSchema.findOne({
            _id: params.id,
            provider: params.provider
        }).exec(function(err, visitor) {
            if (err) {
                callback(new Error("DBA002", err.message));
            } else if (!visitor) {
                callback(new Error("VISITOR002", params.id));
            } else {
                callback(null, new Visitor(visitor));
            }
        });
    };

    static findVisitor(params, callback) {
        if (!params.provider) {
            return callback(new Error("VISITOR004"));
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
                name: 1,
                status: 1,
                email:1,
                visitor:1
            };
        }

        var query = {
            provider: params.provider
        };
        var paginate = {};
        var sort = {};
        paginate.paginate = params.paginate != "false";
        paginate.perPage = params.perPage ? params.perPage : 20;
        paginate.page = params.page ? params.page : 1;
        sort[params.sortBy ? params.sortBy : "name"] = params.sort == -1 ? -1 : 1;

        if (params.search) {
            query = {
                "name.first": {
                    $regex: new RegExp(params.search, "i")
                }
            };
        }
        if (params.name) {
            query = {
                "name.first": params.name.first,
                "name.last": params.name.last
            };
        }
        if (params.email) {
            query = {
                "email": params.email
            };
        }
        if (params.status) {
            query.status = params.status;
        }

        var schemaQuery = VisitorSchema.find(query).select(select);

        if (paginate.paginate) {
            schemaQuery.limit(paginate.perPage).skip(paginate.perPage * (paginate.page - 1));
        }

        schemaQuery.sort(sort).exec(function(err, visitor) {
            if (err) {
                callback(new Error("DBA002", err.message));
            } else {
                callback(null, visitor.map(function(s) {
                    return new Visitor(s)
                }));
            }
        });
    };

};
