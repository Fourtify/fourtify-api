var request = require("supertest");
var chai = require('chai');
var url = "http://127.0.0.1:3001";

var newSetting;
var updateSetting;


var auth = {
    'Authorization': 'Basic NjkzZTlhZjg0ZDNkZmNjNzFlNjQwZTAwNWJkYzVlMmU6ZTY2ODgzNjE1NTYzY2QxN2U1OWQ4NjdiMjhjNDkzZjg=',
    'Content-Type': 'application/x-www-form-urlencoded'
};

var clientInfo = {
    grant_type: 'password',
    email: 'biz@biz.com',
    password: '12345'
};

var provider;
var accessToken;

describe("Settings Tests", function () {

// =========================================================================
// need authentication for tests
// =========================================================================
    it("POST Retrieve a token from server", function (done) {
        request(url)
            .post('/authentication/token')
            .set(auth)
            .send(clientInfo)
            .end(function (err, res) {
                if (err)
                    throw(err);

                res.should.have.property('status', 200);
                res.should.be.json;
                res.body.should.not.be.empty();
                res.body.should.have.property('accessToken');
                res.body.should.have.property('provider');
                res.body.accessToken.should.have.property('_value');
                accessToken = res.body.accessToken._value;

                done();
            });
    });


// =========================================================================
// GET - /settings
// =========================================================================
    it("Should Get settings based on query parameters..", function (done) {
        request(url)
            .get('/settings')
            .set('Authorization', 'Bearer '+ accessToken)
            .end(function (err, res) {
                res.should.have.property('status', 200);
                res.should.be.json;
                res.body.should.have.property('_id');
                res.body.should.have.property('_timezone');
                res.body.should.have.property('_logo');
                res.body.should.have.property('_slack');
                res.body.should.have.property('_theme');
                res.body._theme.should.have.property('primaryColor');
                res.body._theme.should.have.property('secondaryColor');
                done();
            });
    });

    /*
// =========================================================================
//  GET - /settings/count
// =========================================================================
    it("Should Get the number of settings for this provider.", function (done) {
        request(url)
            .get('/settings/count')
            .end(function (err, res) {
                res.should.have.property('status', 200);
                res.should.be.json;
                res.body.should.have.property('count');
                res.body.count.should.be.an.Number();
                done();
            });
    });


// =========================================================================
// GET - /settings
// =========================================================================
    it("Should Get settings based on query parameters..", function (done) {
        request(url)
            .get('/settings')
            .end(function (err, res) {
                res.should.have.property('status', 200);
                res.should.be.json;
                //res.body.should.have.property('provider');
                //res.body.should.have.property('sortBy');
                //res.body.should.have.property('search');
                console.log("provider: "+provider );
                done();
            });
    });

// =========================================================================
// POST - /settings
// =========================================================================
    var settingid;

    it("Should Create a settings", function (done) {
        request(url)
            .post('/settings')
            .send(newSetting)
            .end(function (err, res) {
                res.should.have.property('status', 200);
                res.should.be.json;
                //res.body.should.have.property('provider');
                //res.body.should.have.property('timezone');
                //res.body.should.have.property('logo');
                res.body.should.have.property('settingsId');
                settingid = res.body.settingsId;
                done();
            });
    });


// =========================================================================
// PUT - /settings/:settingsId
// =========================================================================
    it("Should Update settings elements: basically anything except password.", function (done) {
        request(url)
            .put('/settings/' + settingid)
            .send(updateSetting)
            .end(function (err, res) {
                res.should.have.property('status', 200);
                res.should.be.json;
                //res.body.should.have.property('provider');
                //res.body.should.have.property('timezone');
                //res.body.should.have.property('logo');
                done();
            });
    });


// =========================================================================
// DELETE - /settings/:settingsId
// =========================================================================
    it("Should Delete a setting with id.", function (done) {
        request(url)
            .delete('/settings/' + settingid)
            .end(function (err, res) {
                res.should.have.property('status', 200);
                //res.should.be.json;

                done();
            });
    });


*/
});