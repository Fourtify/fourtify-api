var request = require('supertest');
var chai = require('chai');
var url = "http://127.0.0.1:3001";

// var Auth = require("../modules/authentication/src/AuthenticationFactory"); // generate access token using a test provider id

var auth = { 'Authorization': 'Basic NDE1ZTg1YzMxYjJmNDgyZmVhY2FjNzY4Y2IyMzdjZjU6YjQwZGQ0MWY0MTcyYzY2OTdiM2IzYWJkZTcwMWExYzc=', 'Content-Type': 'application/x-www-form-urlencoded' };

var clientInfo = {
     grant_type: 'password',
     email: 'carl@salonfrontdesk.com',
     password: '123456' 
};

var accessId, autho,
    obj = {
        employee: {
            id: '56ab93859876c60b2d7396ac'
        },
        provider: {
            id: '56c5795f3116f7543730c639'
        }
    };

describe("Employees", function(){
    
     it("should receive an authorization accessToken", function(done){
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
            accessId = res.body.accessToken._value;
            done();
        });
     });
    
    it("should have a id", function(done) {
        accessId.should.not.be.empty();
        autho = "Bearer " + accessId;
        done();
    });

     // GET - /employees/count
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
            // in this particular case, 1
            res.body.count.should.be.equal(1);
            done();
        });
    });
    
     // GET - /employees
    it("GET should retrive an employee based on query", function(done){
        request(url)
        .get('/employees')
        .set({'Authorization': autho})
        .end(function(err, res){
            if(err)
                throw(err);

            res.should.have.property('status',200);
            res.should.be.json; 
            res.body[0].should.have.property('_id', "56ab93859876c60b2d7396ac");
            res.body[0].should.have.property('_name');
            res.body[0].should.have.property('_phone');
            res.body[0].should.have.property('_isInDatabase');
            res.body[0].should.have.property('_isPopulated');
            done();
        });
    });
    
    // POST - /employees  Create an employee
    it("POST should create an employee", function(done){
        var form = { 
             phone: '1234567899',
             title: 'idk',
             email: 'abc@yahoo.com',
             password: '123456',
             provider: '56c5795f3116f7543730c639',
             name: 'newEmp' };
        
        request(url)
        .post('/employees')
        .set({'Authorization': autho})
        .send(form)
        .end(function(err, res){
            if(err)
                throw(err);
                
            res.should.have.property('status',200);
            res.should.be.json; 
            done();
        });
    });
    
    // PUT - /employees/:employeeId/profile
    it("PUT should update employee profile", function(done){
        var form = { 
             phone: '1234567899',
             title: 'idk',
             email: 'abc@yahoo.com',
             provider: '56c5795f3116f7543730c639',
             name: 'newEmp' };
        
        request(url)
        .put('/employees/56ab93859876c60b2d7396ac/profile')
        .set({'Authorization': autho, })
        .send(form)
        .end(function(err, res){
            if(err)
                throw(err);
                
            res.should.have.property('status',200);
            res.should.be.json; 
            done();
        });
    });
    
    // PUT - /employees/:employeeId/password
    it("PUT should update employee password", function(done){
        var form = { 
             password: '989898934' };
        
        request(url)
        .put('/employees/56ab93859876c60b2d7396ac/password')
        .set({'Authorization': autho, })
        .send(form)
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
    
    /*
    // DELETE - /employees/:employeeId
    it("DELETE should delete employee", function(done){
        var form = { 
             password: '989898934' };
        
        request(url)
        .delete('/employees/56ab93859876c60b2d7396ac')
        .set({'Authorization': autho, })
        .send(clientInfo)
        .end(function(err, res){
            if(err)
                throw(err);
                
            res.should.have.property('status',200);
            res.should.be.empty(); 
            //res.body.should.have.property('_password');
            //res.body._password.should.be.equal('989898934');
            done();
        });
    });
    */
    
});