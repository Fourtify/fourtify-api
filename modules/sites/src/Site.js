"use strict";

module.exports = class Site {

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
            if (s && s.name) {
                this.name = s.name;
            }
            if (s && s.clientId) {
                this.clientId = s.clientId;
            }
            if (s && s.clientSecret) {
                this.clientSecret = s.clientSecret;
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

    set name(n) {
        this._name = n;
    }
    get name() {
        return this._name || "";
    }

    set clientId(c) {
        this._clientId = c;
    }
    get clientId() {
        return this._clientId || null;
    }

    set clientSecret(c) {
        this._clientSecret = c;
    }
    get clientSecret() {
        return this._clientSecret || "";
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
