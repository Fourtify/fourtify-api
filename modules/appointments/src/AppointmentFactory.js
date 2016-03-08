"use strict";

var async = require("async");

var Appointment = require("./Appointment"),
    AppointmentSchema = require("../schemas/appointments"),
    Error = require("../../errors/src/Error");

module.exports = class AppointmentFactory {

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
        if (queryObj.visitor) {
            query.visitor = queryObj.visitor;
        }
        if (queryObj.start) {
            query.start = queryObj.start;
        }
        if (queryObj.end) {
            query.end = queryObj.end;
        }
        if (queryObj.status) {
            query.status = queryObj.status;
        }
        AppointmentSchema.count(query, function(err, count) {
            if (err) {
                callback(new Error("DBA002", err.message));
            } else {
                callback(null, {count:count});
            }
        });
    };

    //we pass in new Obj Site and callback
    static createAppointment(newObj, callback) {
        var newAppointment = new AppointmentSchema();

        if (!newObj.provider) {
            return callback(new Error("PROVIDER004"));
        } else {
            newAppointment.provider = newObj.provider;
        }
        if (newObj.visitor) {
            newAppointment.visitor = newObj.visitor;
        } else {
            return callback(new Error("APPOINTMENT001"));
        }

        newAppointment.start = newObj.start;
        newAppointment.end = newObj.end;
        newAppointment.status = newObj.status || "created";

        newAppointment.save(function(err, cbAppointment) {
            if (err) {
                callback(new Error("DBA001", err.message));
            } else {
                callback(null, new Appointment(cbAppointment));
            }
        });
    };

    static updateAppointment(updateObj, callback) {
        if (!updateObj.provider) {
            return callback(new Error("PROVIDER004"));
        }
        if (!updateObj.visitor) {
            return callback(new Error("APPOINTMENT001"));
        }
        AppointmentSchema.findOne({
            provider: updateObj.provider,
            _id: updateObj.appointmentId
        }).exec(function(err, appointment) {
            if (err) {
                callback(new Error("DBA003", err.message));
            }
            else {
                if (updateObj.visitor) {
                    appointment.visitor = updateObj.visitor;
                }
                if (updateObj.start) {
                    appointment.start = updateObj.start;
                }
                if (updateObj.end) {
                    appointment.end = updateObj.end;
                }
                if (updateObj.status) {
                    appointment.status = updateObj.status;
                }
                appointment.save(function(err, cbAppointment) {
                    if (err) {
                        callback(new Error("DBA003", err.message));
                    } else {
                        callback(null, new Appointment(cbAppointment));
                    }
                });
            }
        });
    };


    static deleteAppointment(deleteObj, callback) {
        if (!deleteObj.provider) {
            return callback(new Error("PROVIDER004"));
        }

        AppointmentSchema.findOne({
            provider: deleteObj.provider,
            _id: deleteObj.appointmentId
        }).exec(function(err, appointment) {
            if (err) {
                callback(new Error("DBA004", err.message));
            } else if (!appointment) {
                callback(new Error("APPOINTMENT002", deleteObj.appointmentId));
            } else {
                appointment.remove(function(err) {
                    if (err) {
                        callback(new Error("DBA004", err.message));
                    } else {
                        callback(null);
                    }
                });
            }
        });
    };


    static findAppointmentById(params, callback) {
        if (!params.provider) {
            return callback(new Error("PROVIDER004"));
        }

        AppointmentSchema.findOne({
            _id: params.id,
            provider: params.provider
        }).exec(function(err, appointment) {
            if (err) {
                callback(new Error("DBA002", err.message));
            } else if (!appointment) {
                callback(new Error("APPOINTMENT002", params.id));
            } else {
                callback(null, new Appointment(appointment));
            }
        });
    };

    static findAppointment(params, callback) {
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
                visitor: 1,
                status: 1,
                start: 1,
                end: 1
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
        if (params.start) {
            query.start = params.start;
        }
        if (params.end) {
            query.end = params.end;
        }
        if (params.visitor) {
            query.visitor = params.visitor;
        }
        if (params.status) {
            query.status = params.status;
        }

        var schemaQuery = AppointmentSchema.find(query).select(select);

        if (paginate.paginate) {
            schemaQuery.limit(paginate.perPage).skip(paginate.perPage * (paginate.page - 1));
        }

        schemaQuery.sort(sort).exec(function(err, appointment) {
            if (err) {
                callback(new Error("DBA002", err.message));
            } else {
                callback(null, appointment.map(function(s) {
                    return new Appointment(s)
                }));
            }
        });
    };

};
