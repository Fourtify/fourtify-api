var express = require('express');
var router = express.Router();
var AuthMiddleware = require("../../authentication/src/AuthMiddleware");

var SettingsFactory = require('../src/SettingsFactory');
var Error = require("../../errors/src/Error");

// =========================================================================
// GET - /settings/count
// =========================================================================
// Get the number of settings for this provider.
router.get('/count', AuthMiddleware.authenticate(), function(req, res) {
    SettingsFactory.getCount({
        provider: req.provider.id,
        search: req.query.search,
        timezone: req.query.timezone,
        logo: req.query.logo,
        theme: req.query.theme
    }, function(err, count) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(count);
        }
    });
});

// =========================================================================
// GET - /settings
// =========================================================================
// Get settings based on query parameters.
router.get('/', AuthMiddleware.authenticate(), function(req, res) {
    if (req.query.id) {
        SettingsFactory.findSettingsById({
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
        SettingsFactory.findSettings({
            provider: req.provider.id,
            include: req.query.include,
            exclude: req.query.exclude,
            paginate: req.query.paginate,
            perPage: req.query.perPage,
            page: req.query.page,
            sort: req.query.sort,
            sortBy: req.query.sortBy,
            search: req.query.search,
            timezone: req.query.timezone,
            logo: req.query.logo,
            theme: req.query.theme
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
// POST - /settings
// =========================================================================
// Create a settings
router.post('/', AuthMiddleware.authenticate(), function(req, res) {

    if (!req.provider) {
        return res.status(500).send(new Error("PROVIDER004"));
    }

    if (!req.body.name) {
        return res.status(500).send(new Error("SETTINGS001"));
    }

    SettingsFactory.createSettings({
        provider: req.provider.id,
        timezone: req.body.timezone,
        logo: req.body.logo,
        theme: req.body.theme
    }, function(err, data) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(data);
        }
    });
});

// =========================================================================
// PUT - /settings/:settingsId
// =========================================================================
// Update settings elements: basically anything except password
router.put('/:settingsId', AuthMiddleware.authenticate(), function(req, res) {

    if (!req.provider) {
        return res.status(500).send(new Error("PROVIDER004"));
    }

    SettingsFactory.updateSettings({
        provider: req.provider.id,
        settingsId: req.params.settingsId,
        timezone: req.body.timezone,
        logo: req.body.logo,
        theme: req.body.theme
    }, function(err, data) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(data);
        }
    });
});


// =========================================================================
// DELETE - /settings/:settingsId
// =========================================================================
// Delete a settings.
router.delete('/:settingsId', AuthMiddleware.authenticate(), function(req, res) {

    if (!req.provider) {
        return res.status(500).send(new Error("PROVIDER004"));
    }

    SettingsFactory.deleteSettings({
        provider: req.provider.id,
        settingsId: req.params.settingsId
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
