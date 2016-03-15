var request = require("supertest");
var chai = require('chai');
var url = "http://127.0.0.1:3001";

var newQueue;
var updateQueue;

describe("queue", function(){
    
    // GET - /queue/count
    it("Should Get the number of queue for this provider.", function(done){
        request(url)
            .get('/queue/count')
            .end(function(err, res){
                res.should.have.property('status',200);
                res.should.be.json;
                done();
            });
    });
    
    // GET - /queue
    it("Should Get queue based on query parameters.", function(done){
        request(url)
            .get('/queue')
            .end(function(err, res){
                res.should.have.property('status',200);
                res.should.be.json;
                done();
            });
    });
    
    var queueid;
    // POST - /queue
    it("Should Create a queue.", function(done){
        request(url)
            .post('/queue')
            .send(newQueue)
            .end(function(err, res){
                res.should.have.property('status',200);
                res.should.be.json;
                res.body.should.have.property('queueId');
                queueid = res.body.queueId;
                done();
            });
    });
    
    // PUT - /queue/:queueId
    it("Should Update queue elements.", function(done){
        request(url)
            .PUT('/queue/' + queueid)
            .send(updateQueue)
            .end(function(err, res){
                res.should.have.property('status',200);
                res.should.be.json;

                done();
            });
    });
    
    
    // DELETE - /queue/:queueId
    it("Should Delete a queue.", function(done){
        request(url)
            .delete('/queue/' + queueid)
            .end(function(err, res){
                res.should.have.property('status',200);
                //res.should.be.json;
                //res.should.be.empty(); 

                done();
            });
    });
    
    
});