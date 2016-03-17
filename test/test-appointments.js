var request = require("supertest");
var chai = require('chai');
var moment = require("moment");
var url = "http://127.0.0.1:3001";

var d = new Date().getTime();
var start = moment(d);
var end = moment(d).add(1, 'hours');


var tempVisitorId = "56ea079efff772cc283d2de5";




describe("Appointments Tests", function () {

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
// GET - /appointment/count
// =========================================================================
    it("GET Should get the number of appointment for this provider", function (done) {
        request(url)
            .get('/appointments/count')
            .set('Authorization', 'Bearer ' + accessToken)
            .end(function (err, res) {
                if (err)
                    throw(err);

                res.should.have.property('status', 200);
                res.should.be.json;
                res.body.should.have.property('count');
                res.body.count.should.be.an.Number().greaterThanOrEqual(0);
                done();
            });
    });

// =========================================================================
// POST - /visitors/
// =========================================================================

    var tempVisitor = {
        "name": {
            "first": "Donald",
            "last": "Trumbo"
        },
        "email": 'your@fired.com'+d,
        "phone": {
            "type": "cellphone",
            "number": "1234334"
        }
    };


    it('POST Should Create a temp visitor for testing', function (done) {
        request(url)
            .post('/visitors')
            .set('Authorization', 'Bearer ' + accessToken)
            .send(tempVisitor)
            .end(function (err, res) {
                res.should.have.property('status', 200);
                res.should.be.json;
                res.body.should.have.property('_provider');
                res.body.should.have.property('_id');
                tempVisitorId = res.body._id;
                //res.body.should.have.property('_name');
                //res.body.should.have.property('_email');
                //res.body.should.have.property('_phone');
                //res.body.should.have.property('_status');
                done();
            });
    });


// =========================================================================
// POST - /appointment  (create temp appt)
// =========================================================================

    var newAppt = {
        visitor: tempVisitorId,
        start: start,
        end: end
    };

    var tempApptId;

    it("POST Create an appointment", function (done) {
        request(url)
            .post('/appointments')
            .set('Authorization', 'Bearer ' + accessToken)
            .send(newAppt)
            .end(function (err, res) {
                if (err)
                    throw(err);

                res.should.have.property('status', 200);
                res.should.be.json;
                res.body.should.have.property('_id');
                tempApptId = res.body._id;
                res.body.should.have.property('_visitor');
                res.body.should.have.property('_start');
                res.body.should.have.property('_end');
                res.body.should.have.property('_status');
                //res.body.should.have.property('_reason');
                done();
            });
    });

// =========================================================================
// GET - /appointments
// =========================================================================
    it("GET Should get appointments base on query", function (done) {
        request(url)
            .get('/appointments')
            .set('Authorization', 'Bearer ' + accessToken)
            .end(function (err, res) {
                if (err)
                    throw(err);

                res.should.have.property('status', 200);
                res.should.be.json;
                res.body[0].should.have.property('_visitor');
                res.body[0].should.have.property('_start');
                res.body[0].should.have.property('_end');
                res.body[0].should.have.property('_status');
                //res.body.should.have.property('_reason');
                done();
            });
    });



// =========================================================================
// PUT - /appointment/:appointmentId
// =========================================================================
    var updateAppt = {
        visitor: tempVisitorId,
        end: moment(d).add(3, 'hours'),
        status: "Checked-In"
    };

    it("PUT Should update appointment end and status", function (done) {
        request(url)
            .put('/appointments/' + tempApptId)
            .set('Authorization', 'Bearer ' + accessToken)
            .send(updateAppt)
            .end(function (err, res) {
                if (err)
                    throw(err);

                res.should.have.property('status', 200);
                res.should.be.json;
                res.body.should.have.property('_id');
                res.body.should.have.property('_visitor');
                res.body.should.have.property('_start');
                res.body.should.have.property('_end');
                res.body.should.have.property('_status');
                //res.body.should.have.property('_reason');

                done();
            });
    });


// =========================================================================
// DELETE - /appointment/:appointmentId
// =========================================================================
    it("DELETE Should delete an appointment.", function (done) {
        request(url)
            .delete('/appointments/' + tempApptId)
            .set('Authorization', 'Bearer ' + accessToken)
            .end(function (err, res) {
                if (err)
                    throw(err);

                res.should.have.property('status', 200);
                //res.should.be.json;
                //res.should.be.empty();
                done();
            });
    });

});