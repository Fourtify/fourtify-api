"use strict";

var async = require("async");

var QueueHistory = require("./QueueHistory"),
    QueueHistorySchema = require("../schemas/queueHistory"),
    QueueSchema = require("../schemas/queue"),
    ProviderSchema = require("../../providers/schemas/providers"),
    VisitorSchema = require("../../visitors/schemas/visitors"),
    AppointmentSchema = require("../../appointments/schemas/appointments"),
    Error = require("../../errors/src/Error");

module.exports = class QueueHistoryFactory {

    constructor() {}

    //we pass in query Obj and callback
    static getCount(queryObj, callback) {

        var query = {
            provider: queryObj.provider
        };
        QueueHistorySchema.count(query, function(err, count) {
            if (err) {
                callback(new Error("DBA002", err.message));
            } else {
                callback(null, {count:count});
            }
        });
    };

    //we pass in new Obj Site and callback
    static createQueueHistory(newObj, callback) {
        var newQueueHistory = new QueueHistorySchema();

        if (!newObj.provider) {
            return callback(new Error("PROVIDER004"));
        } else {
            newQueueHistory.provider = newObj.provider;
        }
        if (!newObj.visitor) {
            return callback(new Error("Q001"));
        }

        async.series([
                function(cb) {
                    if (newObj.visitor) {
                        VisitorSchema.findById(newObj.visitor).exec(function(err, foundVisitor) {
                            if (err) {
                                return cb(new Error("DBA002", err.message));
                            } else {
                                newQueueHistory.visitor = {
                                    name: {
                                        first: foundVisitor.name.first,
                                        last: foundVisitor.name.last
                                    },
                                    email: foundVisitor.email,
                                    /*phone: {
                                        type: {
                                            type: foundVisitor.phone.type
                                        },
                                        number: foundVisitor.phone.number
                                    },*/
                                    status: foundVisitor.status
                                };
                                if(foundVisitor.phone){
                                    newQueueHistory.visitor.phone = foundVisitor.phone;
                                }
                                return cb(null);
                            }
                        });
                    } else {
                        cb(null);
                    }
                },
                function(cb) {
                    if (newObj.appointment) {
                        AppointmentSchema.findById(newObj.appointment).exec(function(err, foundAppointment) {
                            if (err) {
                                return cb(new Error("DBA002", err.message));
                            } else {
                                newQueueHistory.appointment = {
                                    status: foundAppointment.status,
                                    start: foundAppointment.start,
                                    end: foundAppointment.end
                                };
                                foundAppointment.remove();
                                return cb(null);
                            }
                        });
                    } else {
                        cb(null);
                    }
                },
                function(cb) {
                    if(newObj.queue){
                        QueueSchema.findById(newObj.queue).exec(function(err, foundQueue) {
                            if (err) {
                                return cb(new Error("DBA002", err.message));
                            } else {
                                newQueueHistory.postion = foundQueue.position;
                                foundQueue.remove();
                                return cb(null);
                            }
                        });
                    }
                    else {
                        cb(null);
                    }
                },
                function(cb) {
                    if (newObj.provider) {
                        ProviderSchema.findById(newObj.provider).exec(function(err, foundProvider) {
                            if (err) {
                                return cb(new Error("DBA002", err.message));
                            } else {
                                newQueueHistory.providerObj = {
                                    name: foundProvider.name
                                };
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
                    newQueueHistory.save(function(err, cbQueueHistory) {
                        if (err) {
                            callback(new Error("DBA001", err.message));
                        } else {
                            callback(null, new QueueHistory(cbQueueHistory));
                        }
                    });
                }
            });
    };

    static updateQueueHistory(updateObj, callback) {
        if (!updateObj.provider) {
            return callback(new Error("PROVIDER004"));
        }
        if (!updateObj.visitor) {
            return callback(new Error("Q001"));
        }

        QueueHistorySchema.findOne({
            provider: updateObj.provider,
            _id: updateObj.queueHistoryId
        }).exec(function(err, queueHistory) {
            if (err) {
                callback(new Error("DBA003", err.message));
            } else if (!queueHistory) {
                callback(new Error("Q002", updateObj.queueHistoryId));
            } else {
                async.series([
                        function(cb) {
                            if (updateObj.visitor) {
                                //check if e mail already exists
                                VisitorSchema.findById(updateObj.visitor).exec(function(err, foundVisitor) {
                                    if (err) {
                                        return cb(new Error("DBA002", err.message));
                                    } else {
                                        queueHistory.visitor = {
                                            name: {
                                                first: foundVisitor.name.first,
                                                last: foundVisitor.name.last
                                            },
                                            email: foundVisitor.email,
                                            phone: {
                                                type: {
                                                    type: foundVisitor.phone.type
                                                },
                                                number: foundVisitor.phone.number
                                            },
                                            status: foundVisitor.status
                                        };
                                        return cb(null);
                                    }
                                });
                            } else {
                                cb(null);
                            }
                        },
                        function(cb) {
                            if (updateObj.appointment) {
                                //check if e mail already exists
                                AppointmentSchema.findById(updateObj.appointment).exec(function(err, foundAppointment) {
                                    if (err) {
                                        return cb(new Error("DBA002", err.message));
                                    } else {
                                        queueHistory.appointment = {
                                            status: foundAppointment.status,
                                            start: foundAppointment.start,
                                            end: foundAppointment.end
                                        };
                                        return cb(null);
                                    }
                                });
                            } else {
                                cb(null);
                            }
                        },
                        function(cb) {
                            if (updateObj.provider) {
                                //check if e mail already exists
                                ProviderSchema.findById(updateObj.provider).exec(function(err, foundProvider) {
                                    if (err) {
                                        return cb(new Error("DBA002", err.message));
                                    } else {
                                        queueHistory.providerObj = {
                                            name: foundProvider.name
                                        };
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
                            queueHistory.save(function(err, cbQueueHistory) {
                                if (err) {
                                    callback(new Error("DBA001", err.message));
                                } else {
                                    callback(null, new QueueHistory(cbQueueHistory));
                                }
                            });
                        }
                    });
            }
        });
    };


    static deleteQueueHistory(deleteObj, callback) {
        if (!deleteObj.provider) {
            return callback(new Error("PROVIDER004"));
        }

        QueueHistorySchema.findOne({
            provider: deleteObj.provider,
            _id: deleteObj.queueHistoryId
        }).exec(function(err, queueHistory) {
            if (err) {
                callback(new Error("DBA004", err.message));
            } else if (!queueHistory) {
                callback(new Error("Q002", deleteObj.queueHistoryId));
            } else {
                queueHistory.remove(function(err) {
                    if (err) {
                        callback(new Error("DBA004", err.message));
                    } else {
                        callback(null);
                    }
                });
            }
        });
    };

    static findQueueHistoryById(params, callback) {
        if (!params.provider) {
            return callback(new Error("PROVIDER004"));
        }

        QueueHistorySchema.findOne({
            _id: params.id,
            provider: params.provider
        }).exec(function(err, queueHistory) {
            if (err) {
                callback(new Error("DBA002", err.message));
            } else if (!queueHistory) {
                callback(new Error("Q002", params.id));
            } else {
                callback(null, new QueueHistory(queueHistory));
            }
        });
    };

    static findQueueHistory(params, callback) {
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
                status: 1,
                visitor: 1,
                appointment: 1,
                position: 1
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

        //@todo come back and do necessary calls for finding elements in a queueHistory
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

        var schemaQuery = QueueHistorySchema.find(query).select(select);

        if (paginate.paginate) {
            schemaQuery.limit(paginate.perPage).skip(paginate.perPage * (paginate.page - 1));
        }

        schemaQuery.sort(sort).exec(function(err, queueHistory) {
            if (err) {
                callback(new Error("DBA002", err.message));
            } else {
                callback(null, queueHistory.map(function(s) {
                    return new QueueHistory(s)
                }));
            }
        });
    };

};
