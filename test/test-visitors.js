var request = require("supertest");
var chai = require('chai');
var url = "http://127.0.0.1:3001";

var newVisitor;
var updateVisitor;

describe('POST - /visitor', function(){
    
    // GET - /visitor
    it('Should Get visitor based on query parameters.', function(done){
        request(url)
            .get('/visitor')
            .end(function(err, res){
                res.should.have.property('status',200);
                res.should.be.json;
                res.body.should.have.property('provider');
                res.body.should.have.property('name');
                res.body.should.have.property('email');
                res.body.should.have.property('status');
                //res.body.should.have.property('perPage');
                done();
            });
    });
    
    var visitorid;
    // POST - /visitor
    it('Should Create a visitor', function(done){
        request(url)
            .post('/visitor')
            .send(newVisitor)
            .end(function(err, res){
                res.should.have.property('status',200);
                res.should.be.json;
                res.body.should.have.property('provider');
                res.body.provider.should.have.property('id');
                visitorid = res.body.provider.id;
                res.body.should.have.property('name');
                res.body.should.have.property('email');
                res.body.should.have.property('phone');
                res.body.should.have.property('status');
                done();
            });
    });
    
    // PUT - /visitor/:visitorId
    it('Should Update a visitor', function(done){
        request(url)
            .put('/visitor/' + visitorid)
            .send(updateVisitor)
            .end(function(err, res){
                res.should.have.property('status',200);
                res.should.be.json;
                res.body.should.have.property('provider');
                res.body.should.have.property('name');
                res.body.should.have.property('email');
                res.body.should.have.property('phone');
                res.body.should.have.property('status');
                done();
            });
    });
    
    
    // DELETE - /visitor/:visitorId
    it('Should delete a visitor', function(done){
            request(url)
                .delete('/visitor/' + visitorid)
                .end(function(err, res){
                    res.should.have.property('status',200);
                    //res.should.be.json;           // may be empty?
                    done();
                });
        });
});