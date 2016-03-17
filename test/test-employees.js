var request = require('supertest');
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

var accessId, autho, temProviderId;

describe("Employees", function(){

// =========================================================================
// need authentication for tests
// =========================================================================
     it("POST should receive an authorization accessToken", function(done){
        request(url)
        .post('/authentication/token')
        .set(auth)
        .send(clientInfo)
        .end(function(err, res){
            if(err)
                throw(err);

            res.should.have.property('status',200);
            res.should.be.json;
            res.body.should.not.be.empty();
            res.body.should.have.property('accessToken');
            res.body.accessToken.should.not.be.empty();
            res.body.accessToken._value.should.not.be.empty();
            res.body.should.have.property('provider');
            res.body.provider.should.have.property('_id');
            temProviderId = res.body.provider._id;
            accessId = res.body.accessToken._value;
            done();
        });
     });


    it("should have an id", function(done) {
        accessId.should.not.be.empty();
        autho = "Bearer " + accessId;
        done();
    });


// =========================================================================
// GET - /employees/count
// =========================================================================
    it("GET should get number of employees for this provider", function(done){
        request(url)
        .get('/employees/count')
        .set({'Authorization': autho})
        .end(function(err, res){
            if(err)
                throw(err);
            
            res.should.have.property('status',200);
            res.should.be.json;
            res.body.should.have.property('count');
            res.body.count.should.be.an.Number();
            done();
        });
    });


// =========================================================================
// POST - /employees  Create an employee
// =========================================================================
    var tempEmId;

    it("POST should create an employee", function(done){
        var form = {
            name: {
                first: 'jjj',
                last: 'eir'
            },
            email: 'any@yahoo.com',
            password: '123456',
            title: 'ee',
            phone: {
                type: 'home',
                number: '1231231231'
            }
        };
        
        request(url)
        .post('/employees')
        .set({'Authorization': autho, 'Content-Type': 'application/json'})
        .send(form)
        .end(function(err, res){
            if(err)
                throw(err);
                
            res.should.have.property('status',200);
            res.body.should.have.property('_id');
            tempEmId = res.body._id;
            res.should.be.json; 
            done();
        });
    });


// =========================================================================
// GET - /employees
// =========================================================================
    it("GET should retrive an employee based on query", function(done){
        request(url)
        .get('/employees')
        .set({'Authorization': autho})
        .end(function(err, res){
            if(err)
                throw(err);

            res.should.have.property('status',200);
            res.should.be.json; 
            res.body[0].should.have.property('_id');
            res.body[0].should.have.property('_name');
            res.body[0].should.have.property('_phone');
            res.body[0].should.have.property('_isInDatabase');
            res.body[0].should.have.property('_isPopulated');
            done();
        });
    });
    

// =========================================================================
// PUT - /employees/:employeeId/profile
// =========================================================================
    it("PUT should update employee profile", function(done){
        var form = {
            name: {
                first: 'jjj',
                last: 'eir'
            },
            email: 'newany@yahoo.com'
        };
        
        request(url)
        .put('/employees/'+ tempEmId + '/profile')
        .set({'Authorization': autho, 'Content-Type': 'application/json'})
        .send(form)
        .end(function(err, res){
            if(err)
                throw(err);
                
            res.should.have.property('status',200);
            res.should.be.json; 
            res.body.should.have.property('_email');
            res.body._email.should.be.equal('newany@yahoo.com');
            done();
        });
    });
    
    

// =========================================================================
// PUT - /employees/:employeeId/password
// =========================================================================
    it("PUT should update employee password", function(done){
        var pw = {
            password: "new12345678" };
        
        request(url)
        .put('/employees/' + tempEmId + '/password')
        .set({'Authorization': autho, 'Content-Type': 'application/json'})
        .send(pw)
        .end(function(err, res){
            if(err)
                throw(err);
                
            res.should.have.property('status',200);
            res.should.be.json; 
            //res.body.should.have.property('_password');
            //res.body._password.should.be.equal('989898934');
            done();
        });
    });
    
    

// =========================================================================
// DELETE - /employees/:employeeId
// =========================================================================
    it("DELETE should delete employee", function(done){
        
        request(url)
        .delete('/employees/' + tempEmId)
        .set({'Authorization': autho})
        .end(function(err, res){
            if(err)
                throw(err);
                
            res.should.have.property('status',200);
            //res.should.be.empty(); 
            done();
        });
    });

});