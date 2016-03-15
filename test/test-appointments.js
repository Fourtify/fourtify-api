var request = require("supertest");
var chai = require('chai');
var url = "http://127.0.0.1:3001";

var newAppt ={
	visitor : "56dcc8f380d0fac81daf7765",
	start: "2016-03-13T19:17:45-07:00",
	end: "2016-03-13T19:17:45-07:00"
};

var updateAppt = {
    end: "2016-06-13T19:17:45-07:00"
};

var apptID;

describe("appointments", function(){
    
    //GET - /appointment/count
    it("GET Should get the number of appointment for this provider", function(done){
        request(url)
        .get('/appointment/count')
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
    
    // GET - /appointment
    it("GET Should get appointment based on query parameters.", function(done){
        request(url)
        .get('/appointment')
        .end(function(err, res){
            if(err)
                throw(err);
            
            res.should.have.property('status',200);
            res.should.be.json;

            done();
        });
    });
    
    // POST - /appointment
    it("Create a appointment", function(done){
        request(url)
        .post('/appointment')
        .send(newAppt)
        .end(function(err, res){
            if(err)
                throw(err);
            
            res.should.have.property('status',200);
            res.should.be.json;
            res.body.should.have.property(appointmentId);
            apptID = res.body.appointmentId;

            done();
        });
    });
    
    
    
    // PUT - /appointment/:appointmentId
    it("Should update appointment elements", function(done){
        request(url)
        .put('/appointment/' + apptID)
        .send(updateAppt)
        .end(function(err, res){
            if(err)
                throw(err);
            
            res.should.have.property('status',200);
            res.should.be.json;

            done();
        });
    });
    
    
    
    // DELETE - /appointment/:appointmentId
    it("Should delete a appointment.", function(done){
        request(url)
        .delete('/appointment/' + apptID)
        .end(function(err, res){
            if(err)
                throw(err);
            
            res.should.have.property('status',200);
            //res.should.be.json;
            //res.should.be.empty(); 
            done();
        });
    });
    
});