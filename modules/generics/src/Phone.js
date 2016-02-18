"use strict";
module.exports = class Phone {

    constructor(p) {
        if (p && p.type) {
            this.type = p.type;
        }
        if (p && p.number) {
            this.number = p.number;
        }
    }

    set type(t) {
        this._type = t;
    }
    get type() {
        return this._type || "";
    }

    set number(n) {
        this._number = Number(n.replace(/\[\(\)\]\s\+/g, ""));
    }
    get number() {
        return this._number || "";
    }

};
