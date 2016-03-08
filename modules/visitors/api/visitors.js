var express = require('express');
var router = express.Router();
var AuthMiddleware = require("../../authentication/src/AuthMiddleware");

var VisitorFactory = require('../src/VisitorFactory');
var Error = require("../../errors/src/Error");

// =========================================================================
// GET - /visitor
// =========================================================================
// Get visitor based on query parameters.
//@todo change to allow app access instead of user
router.get('/', /*AuthMiddleware.authenticate(),*/ function(req, res) {
    if (req.query.id) {
        VisitorFactory.findVisitorById({
            id: req.query.id,
            provider: req.body.provider || req.provider.id
        }, function(err, data) {
            if (err) {
                res.status(500).send(err);
            } else {
                console.log("up here: "+JSON.stringify(data));
                res.status(200).send(data);
            }
        });
    } else {
        VisitorFactory.findVisitor({
            provider: req.body.provider || req.provider.id,
            include: req.query.include,
            exclude: req.query.exclude,
            paginate: req.query.paginate,
            perPage: req.query.perPage,
            page: req.query.page,
            sort: req.query.sort,
            sortBy: req.query.sortBy,
            search: req.query.search,
            name: req.query.name,
            email: req.query.email,
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
// POST - /visitor
// =========================================================================
// Create a visitor
router.post('/', AuthMiddleware.authenticate(), function(req, res) {

    if (!req.provider) {
        return res.status(500).send(new Error("PROVIDER004"));
    }

    if (!req.body.name) {
        return res.status(500).send(new Error("VISITOR001"));
    }

    VisitorFactory.createVisitor({
        provider: req.provider.id,
        name: req.body.name,
        email: req.body.email,
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
// PUT - /visitor/:visitorId
// =========================================================================
// Update profile elements
router.put('/:visitorId', AuthMiddleware.authenticate(), function(req, res) {

    if (!req.provider) {
        return res.status(500).send(new Error("PROVIDER004"));
    }

    if (!req.body.name) {
        return res.status(500).send(new Error("VISITOR001"));
    }

    VisitorFactory.updateVisitor({
        provider: req.provider.id,
        visitorId: req.params.visitorId,
        name: req.body.name,
        email: req.body.email,
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
// DELETE - /visitor/:visitorId
// =========================================================================
// Delete a visitor.
router.delete('/:visitorId', AuthMiddleware.authenticate(), function(req, res) {

    if (!req.provider) {
        return res.status(500).send(new Error("PROVIDER004"));
    }

    VisitorFactory.deleteVisitor({
        provider: req.provider.id,
        visitorId: req.params.visitorId
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