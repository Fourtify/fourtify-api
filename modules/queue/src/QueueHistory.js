"use strict";

var Provider = require("../../providers/src/Provider");
var Visitor = require("../../visitors/src/Visitor");
var Appointment = require("../../appointments/src/Appointment");

module.exports = class QueueHistory {

    constructor(q){
        //if empty
        if (!q || Object.keys(q).length === 0) {
            this.id = String(q);
            this.isInDatabase = false;
            this.isPopulated = false;
        }
        //if an id was passed in
        else if (typeof q == "string" || q instanceof String || q._bsontype == "ObjectID") {
            //this.id = String(q);
            this.isInDatabase = true;
            this.isPopulated = false;
        }
        //if an object was passed in
        else if (q && (typeof q == "object" || q instanceof Object)) {
            if (q && q._id) {
                this.id = q.id;
                this.isInDatabase = true;
            } else if (q && q.id) {
                this.id = q.id;
                this.isInDatabase = true;
            }
            if (q && q.provider) {
                this.provider = q.provider;
            }
            if (q && q.visitor) {
                this.visitor = q.visitor;
            }
            if (q && q.appointment) {
                this.appointment = q.appointment;
            }
            if (q && q.position) {
                this.position = q.position;
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

    set appointment(s) {
        this._appointment = s;
    }
    get appointment() {
        return this._appointment|| {};
    }

    set visitor(s) {
        this._visitor = s;
    }
    get visitor() {
        return this._visitor || {};
    }

    set position(s){
        this._position = s
    }
    get position(){
        return this._position;
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
}