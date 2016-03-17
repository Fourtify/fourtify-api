var request = require("supertest");
var chai = require('chai');
var url = "http://127.0.0.1:3001";

var d = new Date().getTime();
var start = moment(d);
var end = moment(d).add(1, 'hours');
var visitorId;
var tempApptId;

describe("queue", function () {


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
// GET - /queue/count
// =========================================================================
    it("Should Get the number of queue for this provider.", function (done) {
        request(url)
            .get('/queue/count')
            .set('Authorization', 'Bearer ' + accessToken)
            .end(function (err, res) {
                res.should.have.property('status', 200);
                res.should.be.json;
                res.body.should.have.property.count;
                done();
            });
    });


// =========================================================================
// GET - /queue
// =========================================================================
    it("Should Get queue based on query parameters.", function (done) {
        request(url)
            .get('/queue')
            .set('Authorization', 'Bearer ' + accessToken)
            .end(function (err, res) {
                res.should.have.property('status', 200);
                res.should.be.json;
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
// POST - /appointment  (create temp appt)
// =========================================================================

    var newAppt = {
        visitor: visitorId,
        start: start,
        end: end
    };



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
// POST - /queue
// =========================================================================

    var newQueue = {
        "visitor": visitorId,
        "appointment": tempApptId
    };

    var queueid;

    it("Should Create a queue.", function (done) {
        request(url)
            .post('/queue')
            .set('Authorization', 'Bearer ' + accessToken)
            .send(newQueue)
            .end(function (err, res) {
                res.should.have.property('status', 200);
                res.should.be.json;
                res.body.should.have.property('queueId');
                queueid = res.body.queueId;
                done();
            });
    });


// =========================================================================
// PUT - /queue/:queueId
// =========================================================================
    it("Should Update queue elements.", function (done) {
        request(url)
            .PUT('/queue/' + queueid)
            .set('Authorization', 'Bearer ' + accessToken)
            .send(updateQueue)
            .end(function (err, res) {
                res.should.have.property('status', 200);
                res.should.be.json;

                done();
            });
    });



// =========================================================================
// DELETE - /queue/:queueId
// =========================================================================
    it("Should Delete a queue.", function (done) {
        request(url)
            .delete('/queue/' + queueid)
            .set('Authorization', 'Bearer ' + accessToken)
            .end(function (err, res) {
                res.should.have.property('status', 200);
                //res.should.be.json;
                //res.should.be.empty(); 

                done();
            });
    });


});