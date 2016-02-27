var express = require('express');
var router = express.Router();
var AuthMiddleware = require("../../authentication/src/AuthMiddleware");

var QueueFactory = require('../src/QueueFactory');
var Error = require("../../errors/src/Error");

// =========================================================================
// GET - /queue/count
// =========================================================================
// Get the number of queue for this provider.
router.get('/count', AuthMiddleware.authenticate(), function(req, res) {
    QueueFactory.getCount({
        provider: req.provider.id
    }, function(err, count) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(count);
        }
    });
});

// =========================================================================
// GET - /queue
// =========================================================================
// Get queue based on query parameters.
router.get('/', AuthMiddleware.authenticate(), function(req, res) {
    if (req.query.id) {
        QueueFactory.findQueueById({
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
        QueueFactory.findQueue({
            provider: req.provider.id,
            include: req.query.include,
            exclude: req.query.exclude,
            paginate: req.query.paginate,
            perPage: req.query.perPage,
            page: req.query.page,
            sort: req.query.sort,
            sortBy: req.query.sortBy,
            search: req.query.search,
            visitor: req.query.visitor,
            appointment: req.query.appointment
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
// POST - /queue
// =========================================================================
// Create a queue
router.post('/', AuthMiddleware.authenticate(), function(req, res) {

    if (!req.provider) {
        return res.status(500).send(new Error("PROVIDER004"));
    }

    if (!req.body.visitor) {
        return res.status(500).send(new Error("Q001"));
    }

    QueueFactory.createQueue({
        provider: req.provider.id,
        visitor: req.body.visitor,
        appointment: req.body.appointment,
        position: req.body.position
    }, function(err, data) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(data);
        }
    });
});

// =========================================================================
// PUT - /queue/:queueId
// =========================================================================
// Update queue elements
router.put('/:queueId', AuthMiddleware.authenticate(), function(req, res) {

    if (!req.provider) {
        return res.status(500).send(new Error("PROVIDER004"));
    }

    if (!req.body.visitor) {
        return res.status(500).send(new Error("Q001"));
    }

    QueueFactory.updateQueue({
        provider: req.provider.id,
        queueId: req.params.queueId,
        visitor: req.body.visitor,
        appointment: req.body.appointment,
        position: req.body.position
    }, function(err, data) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(data);
        }
    });
});

// =========================================================================
// DELETE - /queue/:queueId
// =========================================================================
// Delete a queue.
router.delete('/:queueId', AuthMiddleware.authenticate(), function(req, res) {

    if (!req.provider) {
        return res.status(500).send(new Error("PROVIDER004"));
    }

    QueueFactory.deleteQueue({
        provider: req.provider.id,
        queueId: req.params.queueId
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
