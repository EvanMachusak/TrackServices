"use strict";
exports.__esModule = true;
var express = require("express");
var TrackServices = require("./trackservices.middleware");
var postHandler = function (geo) {
    return { status: 200 };
};
var app = express()
    .use('/activity', TrackServices.post(postHandler));
//# sourceMappingURL=main.js.map