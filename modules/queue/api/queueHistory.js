var express = require('express');
var router = express.Router();
var AuthMiddleware = require("../../authentication/src/AuthMiddleware");

var QueueHistoryFactory = require('../src/QueueHistoryFactory');
var Error = require("../../errors/src/Error");

// =========================================================================
// GET - /queue/history/count
// =========================================================================
// Get the number of queueHistory for this provider.
router.get('/count', AuthMiddleware.authenticate(), function(req, res) {
    QueueHistoryFactory.getCount({
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
// GET - /queue/history
// =========================================================================
// Get queueHistory based on query parameters.
router.get('/', AuthMiddleware.authenticate(), function(req, res) {
    if (req.query.id) {
        QueueHistoryFactory.findQueueHistoryById({
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
        QueueHistoryFactory.findQueueHistory({
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
// POST - /queue/history
// =========================================================================
// Create a queueHistory
router.post('/', AuthMiddleware.authenticate(), function(req, res) {

    if (!req.provider) {
        return res.status(500).send(new Error("PROVIDER004"));
    }

    if (!req.body.visitor) {
        return res.status(500).send(new Error("Q001"));
    }

    QueueHistoryFactory.createQueueHistory({
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
// PUT - /queue/history/:queueHistoryId
// =========================================================================
// Update queueHistory elements
router.put('/:queueHistoryId', AuthMiddleware.authenticate(), function(req, res) {

    if (!req.provider) {
        return res.status(500).send(new Error("PROVIDER004"));
    }

    if (!req.body.visitor) {
        return res.status(500).send(new Error("Q001"));
    }

    QueueHistoryFactory.updateQueueHistory({
        provider: req.provider.id,
        queueHistoryId: req.params.queueHistoryId,
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
// DELETE - /queue/history/:queueHistoryId
// =========================================================================
// Delete a queueHistory.
router.delete('/:queueHistoryId', AuthMiddleware.authenticate(), function(req, res) {

    if (!req.provider) {
        return res.status(500).send(new Error("PROVIDER004"));
    }

    QueueHistoryFactory.deleteQueueHistory({
        provider: req.provider.id,
        queueHistoryId: req.params.queueHistoryId
    }, function(err) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).end();
        }
    });
});

module.exports = router;
