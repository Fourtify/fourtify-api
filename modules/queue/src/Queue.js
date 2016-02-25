"use strict";

var Provider = require("../../providers/src/Provider");

module.exports = class Queue {

    constructor(q){
        //if empty
        if (!q || Object.keys(q).length === 0) {
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
                this.isInDatabase = true;
            } else if (q && q.id) {
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
            /* TODO:
            if (q && q.order) {
                this.order = q.order;
            }
             */
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