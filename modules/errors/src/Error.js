"use strict";

module.exports = class Error {

    constructor(code, optParam1, optParam2, optParam3) {

        this.code = code;

        switch (code) {
            // DATABASE
            case "DBA001":
                this.msg = "Unable to create in database: " + optParam1;
                break;
            case "DBA002":
                this.msg = "Unable to find in database: " + optParam1;
                break;
            case "DBA003":
                this.msg = "Unable to update in database: " + optParam1;
                break;
            case "DBA004":
                this.msg = "Unable to delete in database: " + optParam1;
                break;

            // SITE
            case "SIA001":
                this.msg = "Site name required.";
                break;
            case "SIA002":
                this.msg = "Client ID and Client Secret required.";
                break;
            case "SIA003":
                this.msg = "Site does not exist: " + optParam1;
                break;
            case "SIA004":
                this.msg = "Site is required";
                break;

            default:
                this.msg = "Unknown error";
        }

    }

    set code(c) {
        this._code = c;
    }
    get code() {
        return this._code || "";
    }

    set msg(m) {
        this._msg = m;
    }
    get msg() {
        return this._msg || "";
    }

};
