"use strict";

var Name = require("./../../generics/src/Name"),
    Phone = require("./../../generics/src/Phone"),
    Provider = require("../../providers/src/Provider");

module.exports = class Visitor {
    constructor(u) {

        if (!u || Object.keys(u).length == 0) {
            this.isInDatabase = false;
            this.isPopulated = false;
        } else if (typeof u == "string" || u instanceof String || u._bsontype == "ObjectID") {
            this.isInDatabase = true;
            this.isPopulated = false;
        } else if (u && (typeof u == "object" || u instanceof Object)) {
            this.isPopulated = true;

            if (u && u._id) {
                this.id = u._id;
                this.isInDatabase = true;
            } else if (u && u.id) {
                this.id = u.id;
                this.isInDatabase = true;
            }
            if (u && u.provider) {
                this.provider = u.provider;
            }
            if (u && u.name) {
                this.name = u.name;
            }
            if (u && u.email) {
                this.email = u.email;
            }
            if (u && u.phone) {
                this.phone = u.phone;
            }
            if (u && u.status) {
                this.status = u.status;
            }
        } else {
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


    set name(n) {
        this._name = n instanceof Name ? n : new Name(n);
    }

    get name() {
        return this._name || new Name();
    }

    set email(e) {
        this._email = e;
    }

    get email() {
        return this._email || "";
    }

    set phone(p) {
        if (p instanceof Phone) {
            this._phone = p;
        } else {
            this._phone = new Phone(p);
        }
    }

    get phone() {
        return this._phone || [];
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