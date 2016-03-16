var request = require("supertest");
var chai = require('chai');
var url = "http://127.0.0.1:3001";

/**
 * Base64 encoded Authorization, unique to provider
 * @type {{Authorization: string, Content-Type: string}}
 */
var auth = {
    'Authorization': 'Basic NjkzZTlhZjg0ZDNkZmNjNzFlNjQwZTAwNWJkYzVlMmU6ZTY2ODgzNjE1NTYzY2QxN2U1OWQ4NjdiMjhjNDkzZjg=',
    'Content-Type': 'application/x-www-form-urlencoded'
};
var incorrectAuth = {
    'Authorization': 'Basic NDE1ZTg1YzMxYjJmNDgyZmVhY2FjNzY4Y2IyMzdjZjU6YjQwZGQ0MWY0MTcyYzY2OTdiM2IzYWJkZTcwMWExYzc=',
    'Content-Type': 'application/json'
};

var clientInfo = {
    grant_type: 'password',
    email: 'biz@biz.com',
    password: '12345'
};

var wrongGrandType = {
    grant_type: 'whatever',
    email: 'carl@salonfrontdesk.com',
    password: '123456'
};

var accountNotExist = {
    grant_type: 'password',
    email: 'false@salonfrontdesk.com',
    password: '123456'
};

describe("Authentication", function () {
    // POST /authentication/token
    it("POST Should retrieve a token from server if email exists, using password as grant type", function (done) {
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
                res.body.should.have.property('refreshToken');
                res.body.should.have.property('provider');
                res.body.should.have.property('employee');
                res.body.employee.should.have.property('_email');
                res.body.employee._email.should.be.equal('biz@biz.com');
                res.body.employee.should.have.property('_password');
                res.body.employee._password.should.not.be.empty();
                done();
            });
    });

    // POST returns err if not x-www-form-urlencoded
    it("POST Should get err if not x-www-form-urlencoded", function (done) {
        request(url)
            .post('/authentication/token')
            .set(incorrectAuth)
            .send(clientInfo)
            .end(function (err, res) {
                if (err)
                    throw(err);

                res.should.have.property('status', 500);
                res.should.be.json;
                res.body.should.have.property('_code');
                res.body._code.should.be.equal("AUA001");
                res.body.should.have.property('_msg');
                done();
            });
    });

    // POST returns err if incorrect grant type
    it("POST Should get err if incorrect grant type", function (done) {
        request(url)
            .post('/authentication/token')
            .set(auth)
            .send(wrongGrandType)
            .end(function (err, res) {
                if (err)
                    throw(err);

                res.should.have.property('status', 500);
                res.should.be.json;
                res.body.should.have.property('_code');
                res.body._code.should.be.equal("AUA002");
                res.body.should.have.property('_msg');
                done();
            });
    });

    // POST returns err if authentication is incorrect
    it("POST Should get err if grant type is incorrect", function (done) {
        request(url)
            .post('/authentication/token')
            .set({'Content-Type': 'application/x-www-form-urlencoded'})
            .send(clientInfo)
            .end(function (err, res) {
                if (err)
                    throw(err);

                res.should.have.property('status', 500);
                res.should.be.json;
                res.body.should.have.property('_code');
                res.body._code.should.be.equal("AUA003");
                res.body.should.have.property('_msg');
                done();
            });
    });

    // POST with wrong user data (email)
    it("Should not found provider/employee and return err code if POST with wrong employee data", function (done) {
        request(url)
            .post('/authentication/token')
            .set(auth)
            .send(accountNotExist)
            .end(function (err, res) {
                if (err)
                    throw(err);

                res.should.have.property('status', 500);
                res.should.be.json;
                res.body.should.have.property('_code');
                res.body._code.should.be.equal("EMPLOYEE002");
                res.body.should.have.property('_msg');
                done();
            });
    });

    /*
     //GET /authentication/logout   not implemented yet, thus not testing it now
     it("Should destroy all access and refresh tokens for that user on the site", function(done){
     request(url)
     .get('/authentication/logout')
     .set(auth)
     .send(clientInfo)
     .end(function(err, res){
     res.should.have.property('status',200);
     res.should.be.json;
     res.body.should.not.have.property('refreshToken');
     done();
     });
     });
     */

});
