"use strict";

var async = require("async");

var Employee = require("./Employee"),
    EmployeeSchema = require("../schemas/employees"),
    Error = require("../../errors/src/Error");

module.exports = class EmployeeFactory {

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
        EmployeeSchema.count(query, function(err, count) {
            if (err) {
                callback(new Error("DBA002", err.message));
            } else {
                callback(null, {count:count});
            }
        });
    };

    //we pass in new Obj Site and callback
    static createEmployee(newObj, callback) {
        var newEmployee = new EmployeeSchema();

        if (!newObj.provider) {
            return callback(new Error("PROVIDER004"));
        } else {
            newEmployee.provider = newObj.provider;
        }
        if (newObj.name) {
            newEmployee.name = newObj.name;
        } else {
            return callback(new Error("EMPLOYEE001"));
        }

        newEmployee.title = newObj.title;
        newEmployee.email = newObj.email;
        if (newObj.password) {
            newEmployee.password = newEmployee.generateHash(newObj.password);
        }
        newEmployee.phone = newObj.phone;
        newEmployee.status = newObj.status || "created";

        async.series([
                function(cb) {
                    if (newObj.email) {
                        //check if e mail already exists
                        EmployeeSchema.findOne({
                            provider: newObj.provider,
                            email: newObj.email
                        }).exec(function(err, foundEmployee) {
                            if (err) {
                                return cb(new Error("DBA002", err.message));
                            } else if (foundEmployee) {
                                return cb(new Error("EMPLOYEE007"));
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
                    newEmployee.save(function(err, cbEmployee) {
                        if (err) {
                            callback(new Error("DBA001", err.message));
                        } else {
                            callback(null, new Employee(cbEmployee));
                        }
                    });
                }
            });
    };

    static updateEmployeeProfile(updateObj, callback) {
        if (!updateObj.provider) {
            return callback(new Error("PROVIDER004"));
        }
        if (!updateObj.name) {
            return callback(new Error("EMPLOYEE001"));
        }
        EmployeeSchema.findOne({
            provider: updateObj.provider,
            _id: updateObj.employeeId
        }).select("-password.value").exec(function(err, employee) {
            if (err) {
                callback(new Error("DBA003", err.message));
            } else if (!employee) {
                callback(new Error("EMPLOYEE002", updateObj.employeeId));
            } else {
                if (updateObj.name) {
                    employee.name = updateObj.name;
                }
                if (updateObj.title) {
                    employee.title = updateObj.title;
                }
                if (updateObj.phone) {
                    employee.phone = updateObj.phone;
                }
                if (updateObj.status) {
                    employee.status = updateObj.status;
                }

                async.series([
                        function(cb) {
                            if (updateObj.email) {
                                employee.email = updateObj.email;
                                if (updateObj.email != employee.email) {
                                    //check if e mail already exists
                                    EmployeeSchema.findOne({
                                        provider: updateObj.provider,
                                        email: updateObj.email
                                    }).exec(function(err, foundEmployee) {
                                        if (err) {
                                            cb(new Error("DBA002", err.message));
                                        } else if (foundEmployee) {
                                            return cb(new Error("EMPLOYEE007"));
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
                            employee.save(function(err, cbEmployee) {
                                if (err) {
                                    callback(new Error("DBA003", err.message));
                                } else {
                                    callback(null, new Employee(cbEmployee));
                                }
                            });
                        }
                    });
            }
        });
    };

    static updateEmployeePassword(updateObj, callback) {
        if (!updateObj.provider) {
            return callback(new Error("PROVIDER004"));
        }
        if (updateObj.password) {
            return callback(new Error("EMPLOYEE003"));
        }
        EmployeeSchema.findOne({
            provider: updateObj.provider,
            _id: updateObj.employeeId
        }).exec(function(err, employee) {
            if (err) {
                callback(new Error("DBA003", err.message));
            } else if (!employee) {
                callback(new Error("EMPLOYEE002", updateObj.employeeId));
            } else {
                employee.password = employee.generateHash(updateObj.password);
                employee.save(function(err, cbEmployee) {
                    if (err) {
                        callback(new Error("DBA003", err.message));
                    } else {
                        callback(null, new Employee(cbEmployee));
                    }
                });
            }
        });
    };


    static deleteEmployee(deleteObj, callback) {
        if (!deleteObj.provider) {
            return callback(new Error("PROVIDER004"));
        }

        EmployeeSchema.findOne({
            provider: deleteObj.provider,
            _id: deleteObj.employeeId
        }).exec(function(err, employee) {
            if (err) {
                callback(new Error("DBA004", err.message));
            } else if (!employee) {
                callback(new Error("EMPLOYEE002", deleteObj.employeeId));
            } else {
                employee.remove(function(err) {
                    if (err) {
                        callback(new Error("DBA004", err.message));
                    } else {
                        callback(null);
                    }
                });
            }
        });
    };

    static authenticateEmployee(params, callback) {
        if (!params.provider) {
            return callback(new Error("PROVIDER004"));
        }
        if (!params.email) {
            return callback(new Error("EMPLOYEE004"));
        }
        if (!params.password) {
            return callback(new Error("EMPLOYEE005"));
        }

        var query = {
            provider: params.provider,
            "email": {
                $regex: new RegExp(params.email, "i")
            }
        };
        EmployeeSchema.findOne(query, function(err, employee) {
            if (err) {
                callback(new Error("DBA002", err.message));
            } else if (!employee) {
                callback(new Error("EMPLOYEE002", params.email));
            } else if (!employee.validPassword(params.password)) {
                callback(new Error("EMPLOYEE006"));
            } else {
                delete employee.password;
                callback(null, new Employee(employee));
            }
        });
    };

    static findEmployeeById(params, callback) {
        if (!params.provider) {
            return callback(new Error("PROVIDER004"));
        }

        EmployeeSchema.findOne({
            _id: params.id,
            provider: params.provider
        }).select("-passsword.value").exec(function(err, employee) {
            if (err) {
                callback(new Error("DBA002", err.message));
            } else if (!employee) {
                callback(new Error("EMPLOYEE002", params.id));
            } else {
                callback(null, new Employee(employee));
            }
        });
    };

    static findEmployee(params, callback) {
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
                email: 1,
                title: 1,
                phone: 1
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

        var schemaQuery = EmployeeSchema.find(query).select(select);

        if (paginate.paginate) {
            schemaQuery.limit(paginate.perPage).skip(paginate.perPage * (paginate.page - 1));
        }

        schemaQuery.sort(sort).exec(function(err, employee) {
            if (err) {
                callback(new Error("DBA002", err.message));
            } else {
                callback(null, employee.map(function(s) {
                    return new Employee(s)
                }));
            }
        });
    };

};
