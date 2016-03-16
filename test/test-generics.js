var chai = require('chai');

var Name = require('../modules/generics/src/Name');
var Phone = require('../modules/generics/src/Phone');
var Setting = require('../modules/generics/src/Setting');

describe('Generics Test', function(){
    var n = {
        first: "test",
        middle: "mi",
        last: "ing"
    };
    var name = new Name(n);
    it("should get Name correctly", function(done){
        name.first.should.be.equal("test");
        name.middle.should.be.equal("mi");
        name.last.should.be.equal("ing");
        done();
    });
    
    it("should set Name correctly", function(done){
        name.first = "changed";
        name.first.should.be.equal("changed");
        done();
    });
    
    var p = {
        type: "home",
        number: "1234567890"
    };
    var phone = new Phone(p);
    it("should get Phone correctly", function(done){
        phone.type.should.be.equal("home");
        phone.number.should.be.equal(1234567890);
        done();
    });
    
    it("should set Phone correctly", function(done){
        phone.type = "work";
        phone.number = "9999999999";
        phone.type.should.be.equal("work");
        phone.number.should.be.equal(9999999999);
        done();
    });
    
    var s = {
        module : "visitors",
        name : "te",
        description : "setting test",
        valid : ["test"],
        value: "profile",
        visibility : "private"
    };
    var setting = new Setting(s);

    it("should set Setting correctly", function(done){
        setting.module.should.be.equal("visitors");
        setting.name.should.be.equal("te");
        setting.description.should.be.equal("setting test");
        setting.should.have.property("valid");
        setting.value.should.be.equal("profile");
        setting.visibility.should.be.equal("private");
        done();
    });
    
    it("setVisibility Public/Private should work properly", function(done){
        setting.setVisibilityPublic();
        setting.visibility.should.be.equal("public");
        setting.setVisibilityPrivate();
        setting.visibility.should.be.equal("private");

        done();
    });
});
