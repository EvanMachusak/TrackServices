"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
exports.__esModule = true;
var xmldom = require("xmldom");
var domParser = xmldom.DOMParser;
require("geojson");
exports.post = function (handler) {
    var expressHandler = function (request, response, next) {
        var method = (request.method || "").toLocaleLowerCase();
        if (method == "post") {
            var geoProps = {
                sourceFileName: "test.gpx",
                sourceFormat: "gpx",
                geo: undefined
            };
            var geoRequest = __assign({}, request, geoProps);
            var handlerResult = handler(geoRequest);
            response.status(handlerResult.status);
            if ((handlerResult.contentType || "").length > 0) {
                response.setHeader("content-type", handlerResult.contentType);
            }
            if (handlerResult.responseBody) {
                response.json(handlerResult.responseBody);
            }
        }
        response.end();
    };
    return expressHandler;
};
//# sourceMappingURL=trackservices.middleware.js.map