"use strict";

var async = require("async");

var Queue = require("./Queue"),
    QueueSchema = require("../schemas/queue"),
    Error = require("../../errors/src/Error");

module.exports = class QueueFactory {

    constructor() {}

    //we pass in query Obj and callback
    static getCount(queryObj, callback) {

        var query = {
            provider: queryObj.provider
        };
        QueueSchema.count(query, function(err, count) {
            if (err) {
                callback(new Error("DBA002", err.message));
            } else {
                callback(null, {count:count});
            }
        });
    };

    //we pass in new Obj Site and callback
    static createQueue(newObj, callback) {

        var newQueue = new QueueSchema();

        if (!newObj.provider) {
            return callback(new Error("PROVIDER004"));
        } else {
            newQueue.provider = newObj.provider;
        }
        if (newObj.visitor) {
            newQueue.visitor = newObj.visitor;
        } else {
            return callback(new Error("Q001"));
        }

        newQueue.appointment = newObj.appointment;
        newQueue.position = newObj.position;

        newQueue.save(function(err, cbQueue) {
            if (err) {
                callback(new Error("DBA001", err.message));
            } else {
                callback(null, new Queue(cbQueue));
            }
        });
    };

    static updateQueue(updateObj, callback) {


        if (!updateObj.provider) {
            return callback(new Error("PROVIDER004"));
        }
        if (!updateObj.visitor) {
            return callback(new Error("Q001"));
        }
        console.log("updateObj.appointment: "+updateObj.appointment)
        console.log("updateObj.position: "+updateObj.position)

        /*
        if (updateObj.appointment) {
            //queue.appointment = updateObj.appointment;        //TODO: this line is not correctly updating (crashes)
        }
        if (updateObj.position) {
            queue.position = updateObj.position;                //TODO: this line is not correctly updating (crashes)
        }*/


        QueueSchema.findOne({
            provider: updateObj.provider,
            _id: updateObj.queueId
        }).exec(function(err, queue) {
            if (err) {
                callback(new Error("DBA003", err.message));
            }
            else {
                queue.save(function(err, cbQueue) {
                    if (err) {
                        callback(new Error("DBA003", err.message));
                    } else {
                        callback(null, new Queue(cbQueue));
                    }
                });
            }
        });
    };


    static deleteQueue(deleteObj, callback) {
        if (!deleteObj.provider) {
            return callback(new Error("PROVIDER004"));
        }

        QueueSchema.findOne({
            provider: deleteObj.provider,
            _id: deleteObj.queueId
        }).exec(function(err, queue) {
            if (err) {
                callback(new Error("DBA004", err.message));
            } else if (!queue) {
                callback(new Error("Q002", deleteObj.queueId));
            } else {
                queue.remove(function(err) {
                    if (err) {
                        callback(new Error("DBA004", err.message));
                    } else {
                        callback(null);
                    }
                });
            }
        });
    };

    static findQueueById(params, callback) {
        if (!params.provider) {
            return callback(new Error("PROVIDER004"));
        }

        QueueSchema.findOne({
            _id: params.id,
            provider: params.provider
        }).exec(function(err, queue) {
            if (err) {
                callback(new Error("DBA002", err.message));
            } else if (!queue) {
                callback(new Error("Q002", params.id));
            } else {
                callback(null, new Queue(queue));
            }
        });
    };

    static findQueue(params, callback) {
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
                name: 1,
                status: 1
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

        //@todo come back and do necessary calls for finding elements in a queue
        if (params.search) {
            query = {
                "name.first": {
                    $regex: new RegExp(params.search, "i")
                }
            };
        }
        if (params.name) {
            query = {
                "name.first": {
                    $regex: new RegExp(params.name.first, "i")
                }
            };
        }
        if (params.email) {
            query = {
                "email": {
                    $regex: new RegExp(params.email, "i")
                }
            };
        }
        if (params.status) {
            query.status = params.status;
        }

        var schemaQuery = QueueSchema.find(query).select(select);

        if (paginate.paginate) {
            schemaQuery.limit(paginate.perPage).skip(paginate.perPage * (paginate.page - 1));
        }

        schemaQuery.sort(sort).exec(function(err, queue) {
            if (err) {
                callback(new Error("DBA002", err.message));
            } else {
                callback(null, queue.map(function(s) {
                    return new Queue(s)
                }));
            }
        });
    };

};
