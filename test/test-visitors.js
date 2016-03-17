var request = require("supertest");
var chai = require('chai');
var url = "http://127.0.0.1:3001";

var d = new Date().getTime();



describe("Visitor Tests", function () {

// =========================================================================
// need authentication for tests
// =========================================================================

    var auth = {
        'Authorization': 'Basic NjkzZTlhZjg0ZDNkZmNjNzFlNjQwZTAwNWJkYzVlMmU6ZTY2ODgzNjE1NTYzY2QxN2U1OWQ4NjdiMjhjNDkzZjg=',
        'Content-Type': 'application/x-www-form-urlencoded'
    };

    var clientInfo = {
        grant_type: 'password',
        email: 'biz@biz.com',
        password: '12345'
    };
    var accessToken;

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
// GET - /visitor
// =========================================================================
    it('GET Should Get visitor based on query parameters.', function (done) {
        request(url)
            .get('/visitors')
            .set('Authorization', 'Bearer ' + accessToken)
            .end(function (err, res) {
                res.should.have.property('status', 200);
                res.should.be.json;
                res.body[0].should.have.property('_id');
                res.body[0].should.have.property('_name');
                res.body[0].should.have.property('_email');
                res.body[0].should.have.property('_status');

                done();
            });
    });


// =========================================================================
// POST - /visitor
// =========================================================================

    var tempVisitor = {
        "name": {
            "first": "Donald",
            "last": "Trumbo"+d
        },
        "email": 'your@fired.com'+d,
        "phone": {
            "type": "cellphone",
            "number": "1234334"
        }
    };

    var visitorId;


    it('POST Should Create a visitor', function (done) {
        request(url)
            .post('/visitors')
            .set('Authorization', 'Bearer ' + accessToken)
            .send(tempVisitor)
            .end(function (err, res) {
                res.should.have.property('status', 200);
                res.should.be.json;
                res.body.should.have.property('_id');
                visitorId = res.body._id;
                res.body.should.have.property('_name');
                res.body.should.have.property('_email');
                res.body.should.have.property('_phone');
                res.body.should.have.property('_status');
                done();
            });
    });


// =========================================================================
// PUT - /visitor/:visitorId
// =========================================================================

    var updateVisitor = {
        "name": {
            "first": "David",
            "last": "Bowie"
        },
        "email": "dave@bowie.com",
        "phone": {
            "type":"spacephone",
            "number": "918273"
        }
    };

    it('PUT Should Update a visitor', function (done) {
        request(url)
            .put('/visitors/' + visitorId)
            .set('Authorization', 'Bearer ' + accessToken)
            .send(updateVisitor)
            .end(function (err, res) {
                res.should.have.property('status', 200);
                res.should.be.json;
                res.body.should.have.property('_provider');
                res.body.should.have.property('_name');
                res.body.should.have.property('_email');
                res.body.should.have.property('_phone');
                res.body.should.have.property('_status');
                done();
            });
    });


// =========================================================================
// DELETE - /visitor/:visitorId
// =========================================================================
    it('DELETE Should delete a visitor', function (done) {
        request(url)
            .delete('/visitors/' + visitorId)
            .set('Authorization', 'Bearer ' + accessToken)
            .end(function (err, res) {
                res.should.have.property('status', 200);
                //res.should.be.json;           // may be empty?
                done();
            });
    });
});