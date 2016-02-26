var express = require('express');
var router = express.Router();
var AuthMiddleware = require("../../authentication/src/AuthMiddleware");

var QueueFactory = require('../src/QueueFactory');
var Error = require("../../errors/src/Error");

// =========================================================================
// GET - /queue
// =========================================================================
// Get queue based on query parameters.
router.get('/', AuthMiddleware.authenticate(), function(req, res) {
    if (req.query.id) {
        QueueFactory.findQueueById({
            id: req.query.id,
            provider: req.provider.id
        }, function (err, data) {
            if (err) {
                re.status(500).send(err);
            } else {
                res.status(200).send(data);
            }
        });
    } else{
        QueueFactory.findEmployee({
            provider: req.provider.id,
            include: req.query.include,
            exclude: req.query.exclude,
            paginate: req.query.paginate,
            perPage: req.query.perPage,
            page: req.query.page,
            sort: req.query.sort,
            sortBy: req.query.sortBy,
            order: req.query.order
        }, function(err, data){
            if(err) {
                res.status(500).send(err);
            } else{
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

    QueueFactory.createEmployee({
        provider: req.provider.id,
        order: req.body.order
    }, function(err, data) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(data);
        }
    });
});