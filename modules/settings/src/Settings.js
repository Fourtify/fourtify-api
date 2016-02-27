"use strict";



module.exports = class Settings {

    /**
     *
     * @param input - Can be a string (id) or an object
     */
    constructor(input) {

        //if just an id was passed in
        if (typeof input == "string" || input instanceof String || input._bsontype == "ObjectID") {
            this.id = String(input);
            this.isInDatabase = true;
            this.isPopulated = false;
        }

        //if an object with provider information was passed in
        //need to parse the info tho
        else if (input && (typeof input == "object" || input instanceof Object)) {
            if (input && input._id) {
                this.id = input._id;
                this.isInDatabase = true;
            } else if (input && input.id) {
                this.id = input.id;
                this.isInDatabase = true;
            }
            if (input && input.name) {
                this.name = input.name;
            }
            if (input && input.clientId) {
                this.clientId = input.clientId;
            }
            if (input && input.clientSecret) {
                this.clientSecret = input.clientSecret;
            }
            if (input && input.status) {
                this.status = input.status;
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
    set clientId(c) {
        this._clientId = c;
    }

    get clientId() {
        return this._clientId || null;
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
