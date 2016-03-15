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

            // PROVIDER
            case "PROVIDER001":
                this.msg = "Provider name required.";
                break;
            case "PROVIDER002":
                this.msg = "Client ID and Client Secret required.";
                break;
            case "PROVIDER003":
                this.msg = "Provider does not exist: " + optParam1;
                break;
            case "PROVIDER004":
                this.msg = "Provider is required";
                break;
            case "PROVIDER005":
                this.msg = "Domain already exists: " + optParam1;
                break;
            case "PROVIDER006":
                this.msg = "Domain is required";
                break;
            case "PROVIDER007":
                this.msg = "Domain does not exist: " + optParam1;
                break;

            // AUTHENTICATION
            case "AUA001":
                this.msg = "Method must be POST with application/x-www-form-urlencoded encoding";
                break;
            case "AUA002":
                this.msg = "Invalid or missing grant_type parameter";
                break;
            case "AUA003":
                this.msg = "Authorization header missing or malformed";
                break;
            case "AUA004":
                this.msg = "Username and Password required";
                break;
            case "AUA005":
                this.msg = "Unable to generate Access Token";
                break;
            case "AUA006":
                this.msg = "Employee required to generate Employee Access Token";
                break;
            case "AUA007":
                this.msg = "Customer required to generate Customer Access Token";
                break;
            case "AUA008":
                this.msg = "Site required for Access Token";
                break;
            case "AUA009":
                this.msg = "User Agent required for Access Token";
                break;
            case "AUA010":
                this.msg = "IP Address required for Access Token";
                break;
            case "AUA011":
                this.msg = "Refresh Token value must exist to get new Access Token";
                break;
            case "AUA012":
                this.msg = "Invalid Refresh Token";
                break;
            case "AUA013":
                this.msg = "Refresh Token Expired";
                break;
            case "AUA014":
                this.msg = "Unable to validate information on Refresh Token";
                break;
            case "AUA015":
                this.msg = "Malformed Authentication Header";
                break;
            case "AUA016":
                this.msg = "Invalid Access Token Value";
                break;
            case "AUA017":
                this.msg = "Access Token Expired";
                break;
            case "AUA018":
                this.msg = "Unable to validate information on Access Token";
                break;

            // QUEUE
            case "Q001":
                this.msg = "Visitor is required";
                break;
            case "Q002":
                this.msg = "Appointment is required";
                break;
            case "Q003":
                this.msg = "Queue does not exist:" + optParam1;
                break;

            // EMPLOYEE
            case "EMPLOYEE001":
                this.msg = "Name is required";
                break;
            case "EMPLOYEE002":
                this.msg = "Employee does not exist: " + optParam1;
                break;
            case "EMPLOYEE003":
                this.msg = "Password is required";
                break;
            case "EMPLOYEE004":
                this.msg = "Unable to authenticate without email";
                break;
            case "EMPLOYEE005":
                this.msg = "Unable to authenticate without password";
                break;
            case "EMPLOYEE006":
                this.msg = "Invalid password";
                break;
            case "EMPLOYEE007":
                this.msg = "Employee email already exists";
                break;

            // VISITOR
            case "VISITOR001":
                this.msg = "Name is required";
                break;
            case "VISITOR002":
                this.msg = "Visitor does not exist: " + optParam1;
                break;
            case "VISITOR003":
                this.msg = "Password is required";
                break;
            case "VISITOR004":
                this.msg = "Unable to authenticate without email";
                break;
            case "VISITOR005":
                this.msg = "Unable to authenticate without password";
                break;
            case "VISITOR006":
                this.msg = "Invalid password";
                break;
            case "VISITOR007":
                this.msg = "Visitor email already exists";
                break;

            // APPOINTMENT
            case "APPOINTMENT001":
                this.msg = "Visitor is required";
                break;
            case "APPOINTMENT002":
                this.msg = "appointment does not exist: " + optParam1;
                break;


            // SETTINGS
            case "SETTINGS001":
                this.msg = "Name is required";
                break;
            case "SETTINGS002":
                this.msg = "Settings does not exist: " + optParam1;
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
