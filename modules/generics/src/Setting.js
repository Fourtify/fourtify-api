"use strict";

/*
    STRUCTURE
    ---------
    name: String,
    description: String,
    value: String,
    valid: [String],
    visibility: String
*/

module.exports = class Setting {

    constructor(s) {
        this.module = s.module || "";
        this.name = s.name || "";
        this.description = s.description || "";
        this.valid = s.valid || [];
        this.value = s.value || "";
        this.visibility = s.visibility || "private";
    }

    // SETS & GETS
    // _module
    set module(m) {
        this._module = m;
    }
    get module() {
        return this._module || "";
    }

    // _name
    set name(n) {
        this._name = n;
    }
    get name() {
        return this._name || "";
    }

    // _description
    set description(d) {
        this._description = d;
    }
    get description() {
        return this._description || "";
    }

    // _valid
    set valid(v) {
        this._valid = v;
    }
    get valid() {
        return this._valid || [];
    }

    // _value
    set value(v) {
        if (this.valueIsValid(v)) {
            this._value = v;
        }
    }
    get value() {
        return this._value || "";
    }

    // _visibility
    set visibility(v) {
        this._visibility = v;
    }
    get visibility() {
        return this._visibility || "";
    }

    // METHODS
    valueIsValid(value) {
        if (this._valid.indexOf("*") > -1) {
            return true;
        }
        if (this._valid.indexOf(value) > -1) {
            return true;
        }
        return false;
    }
    setVisibilityPublic() {
        this._visibility = "public";
    }
    setVisibilityPrivate() {
        this._visibility = "private";
    }

};
