"use strict";
var _this = this;
exports.__esModule = true;
var tslib_1 = require("tslib");
var aws = require("aws-sdk");
var promisify = require("es6-promisify");
var xmldom = require("xmldom");
var domParser = new xmldom.DOMParser();
var toGeoJson = require("@mapbox/togeojson");
function newS3() {
    var s3 = new aws.S3();
    var asPromised = {
        getObject: promisify(s3.getObject),
        putObject: promisify(s3.putObject)
    };
    return asPromised;
}
exports.handler = function (event, context, callback) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var s3, _i, _a, record, sourceObject, xml, geoJson, key, fileName, newFileName, putResponse;
    return tslib_1.__generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                s3 = newS3();
                _i = 0, _a = (event.Records || []);
                _b.label = 1;
            case 1:
                if (!(_i < _a.length)) return [3 /*break*/, 4];
                record = _a[_i];
                return [4 /*yield*/, s3.getObject({
                        Bucket: record.s3.bucket.name,
                        Key: record.s3.object.key
                    })];
            case 2:
                sourceObject = _b.sent();
                xml = domParser.parseFromString(String(sourceObject.Body));
                geoJson = toGeoJson.gpx(xml);
                key = record.s3.object.key;
                fileName = key.substring(0, key.lastIndexOf('.'));
                newFileName = fileName + ".json";
                putResponse = s3.
                ;
                _b.label = 3;
            case 3:
                _i++;
                return [3 /*break*/, 1];
            case 4: return [2 /*return*/];
        }
    });
}); };
//# sourceMappingURL=index.js.map