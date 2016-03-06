// only test one case

var chai = require('chai');

var error = require('../modules/errors/src/Error');

describe('Error module', function(){
    var err = new error("DBA001", "visitor");
    it("should contain the same error code assigned", function(done){
        err.code.should.be.equal("DBA001");
        done();
    });
    
    it("should contain the correct err msg", function(done){
        err.msg.should.be.equal("Unable to create in database: " + "visitor");
        done();
    });
});
        