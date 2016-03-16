"use strict";

var Provider = require("../../providers/src/Provider");

module.exports = class Settings {

    constructor(u) {
        //if empty
        if (!u || Object.keys(u).length === 0) {
            this.isInDatabase = false;
            this.isPopulated = false;
        }
        //if an id was passed in
        else if (typeof u == "string" || u instanceof String || u._bsontype == "ObjectID") {
            //this.id = String(u);
            this.isInDatabase = true;
            this.isPopulated = false;
        }
        //if an object was passed in
        else if (u && (typeof u == "object" || u instanceof Object)) {
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
            if (u && u.timezone) {
                this.timezone = u.timezone;
            }
            if (u && u.logo) {
                this.logo = u.logo;
            }
            if (u && u.slack) {
                this.slack = u.slack;
            }
            if (u && u.theme) {
                this.theme = u.theme;
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

    set timezone(n) {
        this._timezone = n;
    }
    get timezone() {
        return this._timezone || "";
    }

    set logo(n) {
        this._logo = n;
    }
    get logo() {
        return this._logo || "";
    }

    set slack(n) {
        this._slack = n;
    }
    get slack() {
        return this._slack || "";
    }


    set theme(n) {
        this._theme = n;
    }
    get theme() {
        return this._theme || {};
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
