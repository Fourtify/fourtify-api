"use strict";

var Provider = require("../../providers/src/Provider"),
    Visitor = require("../../visitors/src/Visitor");

module.exports = class Appointment {

    constructor(s) {

        //if an id was passed in
        if (typeof s == "string" || s instanceof String || s._bsontype == "ObjectID") {
            this.id = String(s);
            this.isInDatabase = true;
            this.isPopulated = false;
        }

        //if an object was passed in
        else if (s && (typeof s == "object" || s instanceof Object)) {
            if (s && s._id) {
                this.id = s._id;
                this.isInDatabase = true;
            } else if (s && s.id) {
                this.id = s.id;
                this.isInDatabase = true;
            }
            if (s && s.provider) {
                this.provider = s.provider;
            }
            if (s && s.visitor) {
                this.visitor = s.visitor;
            }
            if (s && s.start) {
                this.start = s.start;
            }
            if (s && s.end) {
                this.end = s.end;
            }
            if (s && s.status) {
                this.status = s.status;
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

    set provider(s) {
        this._provider = s instanceof Provider ? s : new Provider(s);
    }
    get provider() {
        return this._provider || new Provider();
    }

    set visitor(s) {
        this._visitor = s instanceof Visitor ? s : new Visitor(s);
    }
    get visitor() {
        return this._visitor || new Visitor();
    }

    set start(s){
        this._start = s;
    }

    get start(){
        return this._start || "";
    }

    set end(s){
        this._end = s;
    }

    get end(){
        return this._end || "";
    }

    set status(s) {
        this._status = s;
    }
    get status() {
        return this._status || "";
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
