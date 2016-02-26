"use strict";

var Queue = require("./Queue"),
    QueueSchema = require("../schemas/queue"),
    Error = require("../../errors/src/Error");

module.exports = class QueueFactory{

    constructor() {}

    static createQueue(newObj, callback){
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

        if (newObj.appointment){
            newQueue.appointment = newObj.appointment;
        } else{
            return callback(new Error("Q002"))
        }



        newQueue.order = newObj.order;

        //TODO: async series?






    };

    static updateQueue(updateObj, callback){
        if(!updateObj.provider){
            return callback(new Error("PROVIDER004"));
        }

        QueueSchema.findById(updateObj.id).exec(function(err, queue){
            if (err) {
                return callback(new Error("DBA003", err.message));
            } else if (!queue) {
                return callback(new Error("Q003", updateObj.id));
            } else{
                if(updateObj.visitors){
                    queue.visitors = updateObj.visitors;
                }
                if(updateObj.providers){
                    queue.providers = updateObj.providers;
                }
                if(updateObj.appointments){
                    queue.appointments = updateObj.appointments;
                }
                if(updateObj.position){
                    queue.position = updateObj.position;
                }

                //TODO: Async series?
            }
        });
    };

    static deleteQueue(deleteObj, callback){
        if(!deleteObj.provider) {
            return callback(new error("PROVIDER004"));
        }
        QueueSchema.findOne({
            provider:deleteObj.provider
        }).exec(function(err, queue){
            if(err){
                callback(new Error("DBA004", err.message));
            } else if(!queue){
                callback(new Error("Q003", deleteObj.queue));
            } else{
                queue.remove(function(err){
                    if (err) {
                        callback(new Error("DBA004", err.message));
                    } else{
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
                callback(new Error("Q003", params.id));
            } else {
                callback(null, new Queue(queue));
            }
        });
    };

    static findQueue(params, callback){
        if(!params.provider){
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

        if (params.order) {
            query = {
                "order": {
                    $regex: new RegExp(params.order, "i")
                }
            };
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

}