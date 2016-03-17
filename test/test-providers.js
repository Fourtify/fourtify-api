var request = require("supertest");
var chai = require('chai');
var url = "http://127.0.0.1:3001";


var d = new Date();
var salt = d.getTime();
var nameToUse = 'TheRealTrump' + salt;
var providerId;

var updatedName = 'DonDonJonJon';
var updatedStatus = 'Fired!';


/** Real stupid dummy info to use for testing */
var providerCreate = {

    provider: {
        name: 'Donald J Trump',
        domain: nameToUse
    },
    employee: {
        name: {
            first: 'Donald',
            last: 'Trump Jr.'
        },
        email: 'donald@trump.com',
        password: '123456',
        title: 'Overlord',
        phone: {
            type: 'Palindrome',
            number: '123454321'
        }
    }

};

/**
 * REQ: Provider = name (string), domain
 * REQ: Employee = name (object), email, password, title |  OPT: phone (object)
 */
var badProviderInfo = {
    provider: {
        name: 'Donald J Trump',
        //omit domain to prevent creation
    },
    employee: {
        name: {
            first: 'Donald',
            last: 'Trump Jr.'
        },
        email: 'donald@trump.com',
        password: '123456',
        title: 'Overlord',
        phone: "12345"          //Wrong phone format will cause failure
    }
};

var providerNameUpdate = {
    name: updatedName
};

var providerStatusUpdate = {
    status: updatedStatus
};


describe("Providers Tests", function () {

// =========================================================================
// POST create new provider
// =========================================================================
    it("POST Should create provider with initial employee", function (done) {
        request(url)
            .post('/providers')
            .send(providerCreate)
            .end(function (err, res) {
                if (err)
                    throw(err);

                res.should.have.property('status', 200);
                res.should.be.json;
                res.body.should.not.be.empty();

                //Provider checks
                res.body.should.have.property('provider');
                res.body.provider.should.have.property('_id');
                providerId = res.body.provider._id;
                res.body.provider._id.should.not.be.empty();

                //Employee checks
                res.body.should.have.property('employee');

                /*
                 res.body.should.have.property('_password');
                 res.body.should.have.property('_phone');
                 res.body.should.have.property('_status');
                 res.body.should.have.property('_isPopulated');

                 res.body.provider.should.have.property('_id');
                 res.body.provider._id.should.not.be.empty();
                 res.body.provider.should.have.property('_isInDatabase');
                 res.body.provider.should.have.property('_name');
                 res.body.provider.should.have.property('_clientId');
                 res.body.provider.should.have.property('_clientSecret');
                 res.body.provider.should.have.property('_status');
                 res.body.provider.should.have.property('_isPopulated');
                 */
                done();
            });
    });


// =========================================================================
// POST with bad create input
// =========================================================================
    it("POST should error if provider info wrong", function (done) {
        request(url)
            .post('/providers')
            .send(badProviderInfo)
            .end(function (err, res) {
                if (err)
                    throw(err);

                res.should.have.property('status', 500);
                res.should.be.json;
                res.body.should.have.property('_code');
                res.body._code.should.be.equal("PROVIDER006");
                res.body.should.have.property('_msg');
                done();
            });
    });


// =========================================================================
// PUT update provider name
// =========================================================================
    it("PUT Should update provider name", function (done) {
        request(url)
            .put('/providers/' + providerId)
            .send(providerNameUpdate)
            .end(function (err, res) {
                res.should.have.property('status', 200);
                res.should.be.json;
                res.body.should.have.property('_name');
                res.body._name.should.be.equal(updatedName);
                done();
            });
    });


// =========================================================================
// PUT update provider status
// =========================================================================
    it("PUT Should update provider status", function (done) {
        request(url)
            .put('/providers/' + providerId)
            .send(providerStatusUpdate)
            .end(function (err, res) {
                res.should.have.property('status', 200);
                res.should.be.json;
                res.body.should.have.property('_status');
                res.body._status.should.be.equal(updatedStatus);
                done();
            });
    });


// =========================================================================
// DELETE remove provider
// =========================================================================
    it("DELETE Should delete newly created provider", function (done) {
        request(url)
            .delete('/providers/' + providerId)
            .end(function (err, res) {
                res.should.have.property('status', 200);
                done();
            });
    });


});
