"use strict";

var Provider = require("../../providers/src/Provider");
var Employee = require("../../employee/src/Employee");

module.exports = class AccessToken {

    constructor(a) {

        //if an id was passed in
        if (typeof a == "string" || a instanceof String || a._bsontype == "ObjectID") {
            this.id = a;
            this.isInDatabase = true;
            this.isPopulated = false;
        }

        //if an object was passed in
        else if (a && (typeof a == "object" || a instanceof Object)) {
            if (a && a._id) {
                this.id = a._id;
                this.isInDatabase = true;
            } else if (a && a.id) {
                this.id = a.id;
                this.isInDatabase = true;
            }
            if (a && a.value) {
                this.value = a.value;
            }
            if (a && a.employee) {
                this.employee = a.employee;
            }
            if (a && a.expires) {
                this.expires = a.expires;
            }
            if (a && a.provider) {
                this.provider = a.provider;
            }
            this.isPopulated = true;
        }

        //if nothing was passed in
        else {
            this.isInDatabase = false;
            this.isPopulated = false;
        }
    }

    set id(i) {
        this._id = i;
    }
    get id() {
        return this._id || "";
    }

    set value(v) {
        this._value = v;
    }
    get value() {
        return this._value || "";
    }

    set employee(s) {
        this._employee = s instanceof Employee ? s : new Employee(s);
    }
    get employee() {
        return this._employee || "";
    }

    set expires(e) {
        this._expires = e;
    }
    get expires() {
        return this._expires || "";
    }

    set provider(s) {
        this._provider = s instanceof Provider ? s : new Provider(s);
    }
    get provider() {
        return this._provider || new Provider();
    }

    set isPopulated(b) {
        this._isPopulated = b;
    }
    get isPopulated() {
        return this._isPopulated || false;
    }

    set isInDatabase(b) {
        this._isInDatabase = b;
    }
    get isInDatabase() {
        return this._isInDatabase || false;
    }

};
