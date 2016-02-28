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
                this._id = input._id;
                this.isInDatabase = true;
            } else if (input && input.providerId) {
                this.providerId = input.providerId;
                this.isInDatabase = true;
            } else if (input && input.primaryColor) {       //TODO: Use theme object, move colors/logo to it
                this.primaryColor = input.primaryColor;
                this.isInDatabase = true;
            } else if (input && input.secondaryColor) {
                this.secondaryColor = input.secondaryColor;
                this.isInDatabase = true;
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

    set providerId(c) {
        this.providerId = c;
    }

    get providerId() {
        return this.providerId;
    }


    set primaryColor(c) {
        this.primaryColor = c;
    }

    get primaryColor() {
        return this.primaryColor;
    }

    set secondaryColor(c) {
        this.secondaryColor = c;
    }

    get secondaryColor() {
        return this.secondaryColor;
    }

    set logo(c) {
        this.logo = c;
    }

    get logo() {
        return this.logo;
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
