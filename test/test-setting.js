var request = require("supertest");
var chai = require('chai');
var url = "http://127.0.0.1:3001";

var newSetting;
var updateSetting;

describe("settings", function(){
    
    // GET - /settings/count
    it("Should Get the number of settings for this provider.", function(done){
        request(url)
            .get('/settings/count')
            .end(function(err, res){
                res.should.have.property('status',200);
                res.should.be.json;
                res.body.should.have.property('count');
                res.body.count.should.be.an.Number();
                done();
            });
    });
    
    // GET - /settings
    it("Should Get settings based on query parameters..", function(done){
        request(url)
            .get('/settings')
            .end(function(err, res){
                res.should.have.property('status',200);
                res.should.be.json;
                //res.body.should.have.property('provider');
                //res.body.should.have.property('sortBy');
                //res.body.should.have.property('search');
                done();
            });
    });
    
    var settingid;
    // POST - /settings
    it("Should Create a settings", function(done){
        request(url)
            .post('/settings')
            .send(newSetting)
            .end(function(err, res){
                res.should.have.property('status',200);
                res.should.be.json;
                //res.body.should.have.property('provider');
                //res.body.should.have.property('timezone');
                //res.body.should.have.property('logo');
                res.body.should.have.property('settingsId');
                settingid = res.body.settingsId;
                done();
            });
    });
    
    
    // PUT - /settings/:settingsId
    it("Should Update settings elements: basically anything except password.", function(done){
        request(url)
            .put('/settings/' + settingid)
            .send(updateSetting)
            .end(function(err, res){
                res.should.have.property('status',200);
                res.should.be.json;
                //res.body.should.have.property('provider');
                //res.body.should.have.property('timezone');
                //res.body.should.have.property('logo');
                done();
            });
    });
    
    // DELETE - /settings/:settingsId
    it("Should Delete a setting with id.", function(done){
        request(url)
            .delete('/settings/' + settingid)
            .end(function(err, res){
                res.should.have.property('status',200);
                //res.should.be.json;

                done();
            });
    });
    
});