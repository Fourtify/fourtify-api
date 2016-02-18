"use strict";
module.exports = class Name {

    constructor(n) {
        if (n && n.first) {
            this.first = n.first;
        }
        if (n && n.middle) {
            this.middle = n.middle;
        }
        if (n && n.last) {
            this.last = n.last;
        }
    }

    set first(f) {
        this._first = f;
    }
    get first() {
        return this._first || "";
    }

    set middle(m) {
        this._middle = m;
    }
    get middle() {
        return this._middle || "";
    }

    set last(l) {
        this._last = l;
    }
    get last() {
        return this._last || "";
    }
};
