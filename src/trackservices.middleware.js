"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var toGeoJson = require("@mapbox/togeojson");
var xmldom = require("xmldom");
var domParser = new xmldom.DOMParser();
require("geojson");
exports.post = function (handler) {
    var expressHandler = function (request, response, next) {
        var method = (request.method || "").toLocaleLowerCase();
        var requestFiles = request.files;
        var files = [];
        for (var key in requestFiles)
            files.push(requestFiles[key]);
        var geoProps = {
            sourceFileName: "test.gpx",
            sourceFormat: "gpx",
            geo: undefined
        };
        if (files && files.length == 1) {
            var fileBuffer = files[0].data;
            var xml = domParser.parseFromString(fileBuffer.toString("utf8"));
            var geoJson = toGeoJson.gpx(xml);
            geoProps.geo = geoJson;
        }
        else if (files && files.length > 1) {
            response.json("At most 1 file should be included in this request");
            response.end;
            return;
        }
        var geoRequest = tslib_1.__assign({}, request, geoProps);
        var handlerResult = handler(geoRequest);
        response.status(handlerResult.status);
        if ((handlerResult.contentType || "").length > 0) {
            response.setHeader("content-type", handlerResult.contentType);
        }
        if (handlerResult.body) {
            response.json(handlerResult.body);
        }
        response.end();
    };
    return expressHandler;
};
//# sourceMappingURL=trackservices.middleware.js.map