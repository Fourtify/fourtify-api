var request = require("supertest");
var chai = require('chai');
var url = "http://127.0.0.1:3001";


var auth = {
    'Authorization': 'Basic NjkzZTlhZjg0ZDNkZmNjNzFlNjQwZTAwNWJkYzVlMmU6ZTY2ODgzNjE1NTYzY2QxN2U1OWQ4NjdiMjhjNDkzZjg=',
    'Content-Type': 'application/x-www-form-urlencoded'
};

var clientInfo = {
    grant_type: 'password',
    email: 'biz@biz.com',
    password: '12345'
};

//Temp settings
var createTheseSettings = {
    "name": "TempName",
    "timezone": "Middle Earth",
    "logo": "http://www.logologo.com/logos/generic-globe-vector-logo.jpg",
    "slack": "tight-pants",
    "theme": {
        "primaryColor": "03A9F4",
        "secondaryColor": "B3E5FC"
    }
};

var d = new Date();
var salt = d.getTime();

//Edit provider settings
var updateTheseSettings = {
    "name": "Tesla"+salt,
    "timezone": "Brotown/New Jersey/"+salt,
    "logo": "http://www.logologo.com/logos/generic-globe-vector-logo-"+salt+".jpg",
    "slack": "slack-face-"+salt
};

var accessToken;

describe("Settings Tests", function () {

// =========================================================================
// need authentication for tests
// =========================================================================
    it("POST Retrieve an auth token from server", function (done) {
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
//  GET - /settings/count
// =========================================================================
    it("Should Get the number of settings for this provider.", function (done) {
        request(url)
            .get('/settings/count')
            .set('Authorization', 'Bearer '+ accessToken)
            .end(function (err, res) {
                res.should.have.property('status', 200);
                res.should.be.json;
                res.body.should.have.property('count');
                res.body.count.should.be.an.Number();
                done();
            });
    });

// =========================================================================
// GET - /settings  (get settings)
// =========================================================================
    it("Should get all settings return values", function (done) {
        request(url)
            .get('/settings')
            .set('Authorization', 'Bearer '+ accessToken)
            .end(function (err, res) {
                res.should.have.property('status', 200);
                res.should.be.json;
                res.body.should.have.property('_id');
                res.body.should.have.property('_timezone');

                //Optional
                //res.body.should.have.property('_logo');
                //res.body.should.have.property('_slack');
                //res.body.should.have.property('_theme');
                //res.body._theme.should.have.property('primaryColor');
                //res.body._theme.should.have.property('secondaryColor');
                done();
            });
    });


// =========================================================================
// PUT - /settings/:settingsId (update settings)
// =========================================================================
    it("Should Update settings elements: provider, timezone, logo, slack, theme", function (done) {
        request(url)
            .put('/settings/')
            .send(updateTheseSettings)
            .set('Authorization', 'Bearer '+ accessToken)
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
// POST - /settings (create temp settings)
// =========================================================================
    var tempSettingsId;

    it("Should Create a temp settings", function (done) {
        request(url)
            .post('/settings')
            .set('Authorization', 'Bearer '+ accessToken)
            .send(createTheseSettings)
            .end(function (err, res) {
                res.should.have.property('status', 200);
                res.should.be.json;
                res.body.should.have.property('_id');
                tempSettingsId = res.body._id;

                done();
            });
    });


// =========================================================================
// GET - /settings (get temp settings)
// =========================================================================
    it("Should Get settings based on query parameters: id", function (done) {
        request(url)
            .get('/settings?id=' + tempSettingsId)
            .set('Authorization', 'Bearer '+ accessToken)
            .end(function (err, res) {
                res.should.have.property('status', 200);
                res.should.be.json;
                res.body.should.have.property('_id');
                res.body.should.have.property('_timezone');
                //Optional
                //res.body.should.have.property('_logo');
                //res.body.should.have.property('_slack');
                //res.body.should.have.property('_theme');
                //res.body._theme.should.have.property('primaryColor');
                //res.body._theme.should.have.property('secondaryColor');

                done();
            });
    });



// =========================================================================
// DELETE - /settings/:settingsId (delete temp settings)
// =========================================================================
    it("Should Delete a setting with id.", function (done) {
        request(url)
            .delete('/settings/' + tempSettingsId)
            .set('Authorization', 'Bearer '+ accessToken)
            .end(function (err, res) {
                res.should.have.property('status', 200);
                //res.should.be.json;

                done();
            });
    });






});