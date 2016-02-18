var express = require('express');
var router = express.Router();
var AuthMiddleware = require("../../authentication/src/AuthMiddleware");

var EmployeeFactory = require('../src/EmployeeFactory');
var Error = require("../../errors/src/Error");

// =========================================================================
// GET - /employee/count
// =========================================================================
// Get the number of employee for this provider.
router.get('/count', AuthMiddleware.authenticate(), function(req, res) {
    EmployeeFactory.getCount({
        provider: req.provider.id,
        search: req.query.search,
        name: req.query.name,
        email: req.query.email ? req.query.email.value : undefined,
        status: req.query.status
    }, function(err, count) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(count);
        }
    });
});

// =========================================================================
// GET - /employee
// =========================================================================
// Get employee based on query parameters.
router.get('/', AuthMiddleware.authenticate(), function(req, res) {
    if (req.query.id) {
        EmployeeFactory.findEmployeeById({
            id: req.query.id,
            provider: req.provider.id
        }, function(err, data) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.status(200).send(data);
            }
        });
    } else {
        EmployeeFactory.findEmployee({
            provider: req.provider.id,
            include: req.query.include,
            exclude: req.query.exclude,
            paginate: req.query.paginate,
            perPage: req.query.perPage,
            page: req.query.page,
            sort: req.query.sort,
            sortBy: req.query.sortBy,
            search: req.query.search,
            name: req.query.name,
            email: req.query.email ? req.query.email.value : undefined,
            status: req.query.status
        }, function(err, data) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.status(200).send(data);
            }
        });
    }
});

// =========================================================================
// POST - /employee
// =========================================================================
// Create a employee
router.post('/', AuthMiddleware.authenticate(), function(req, res) {

    if (!req.provider) {
        return res.status(500).send(new Error("PROVIDER004"));
    }

    if (!req.body.name) {
        return res.status(500).send(new Error("EMPLOYEE001"));
    }

    EmployeeFactory.createEmployee({
        provider: req.provider.id,
        name: req.body.name,
        title: req.body.title,
        email: req.body.email,
        password: req.body.password,
        phone: req.body.phone,
        status: req.body.status
    }, function(err, data) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(data);
        }
    });
});

// =========================================================================
// PUT - /employee/:employeeId/profile
// =========================================================================
// Update profile elements: basically anything except password
router.put('/:employeeId/profile', AuthMiddleware.authenticate(), function(req, res) {

    if (!req.provider) {
        return res.status(500).send(new Error("PROVIDER004"));
    }

    if (!req.body.name) {
        return res.status(500).send(new Error("EMPLOYEE001"));
    }

    EmployeeFactory.updateEmployeeProfile({
        provider: req.provider.id,
        employeeId: req.params.employeeId,
        name: req.body.name,
        title: req.body.title,
        email: req.body.email,
        phone: req.body.phone,
        status: req.body.status,
    }, function(err, data) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(data);
        }
    });
});

// =========================================================================
// PUT - /employee/:employeeId/password
// =========================================================================
// Update employee passwords
router.put('/:employeeId/password', AuthMiddleware.authenticate(), function(req, res) {

    if (!req.provider) {
        return res.status(500).send(new Error("PROVIDER004"));
    }

    if (!req.body.password) {
        return res.status(500).send(new Error("EMPLOYEE003"));
    }

    EmployeeFactory.updateEmployeePassword({
        provider: req.provider.id,
        employeeId: req.params.employeeId,
        password: req.body.password
    }, function(err, data) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(data);
        }
    });
});


// =========================================================================
// DELETE - /employee/:employeeId
// =========================================================================
// Delete a employee.
router.delete('/:employeeId', AuthMiddleware.authenticate(), function(req, res) {

    if (!req.provider) {
        return res.status(500).send(new Error("PROVIDER004"));
    }

    EmployeeFactory.deleteEmployee({
        provider: req.provider.id,
        employeeId: req.params.employeeId
    }, function(err) {
        if (err) {
            res.status(500).send(err);
        } else {
            //@todo transfer future records and write all past records to history
            res.status(200).end();
        }
    });
});

module.exports = router;
