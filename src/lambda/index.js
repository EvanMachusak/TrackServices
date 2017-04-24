"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t;
    return { next: verb(0), "throw": verb(1), "return": verb(2) };
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var aws = require("aws-sdk");
var promisify = require("es6-promisify");
var xmldom = require("xmldom");
var domParser = new xmldom.DOMParser();
var toGeoJson = require("@mapbox/togeojson");
var log = (process.env.suppressLogs || false)
    ? console.log
    : function (message) { };
function newS3() {
    var s3 = new aws.S3();
    var asPromised = {
        getObject: promisify(s3.getObject.bind(s3)),
        putObject: promisify(s3.putObject.bind(s3))
    };
    return asPromised;
}
exports.handler = function (event, context, callback) { return __awaiter(_this, void 0, void 0, function () {
    var s3, _i, _a, record, bucket, key, sourceObject, body, xml, geoJson, fileName, newFileName, putResponse;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                s3 = newS3();
                _i = 0, _a = (event.Records || []);
                _b.label = 1;
            case 1:
                if (!(_i < _a.length)) return [3 /*break*/, 5];
                record = _a[_i];
                bucket = record.s3.bucket.name;
                key = record.s3.object.key;
                log("Attempting to get objecct from bucket " + bucket + " with key " + key + "...");
                return [4 /*yield*/, s3.getObject({
                        Bucket: bucket,
                        Key: key,
                    })];
            case 2:
                sourceObject = _b.sent();
                body = String(sourceObject.Body || '');
                log("...success.  Received a body of length " + body.length);
                log('Parsing as XML...');
                xml = domParser.parseFromString(body);
                log('...success');
                log('Converting to GeoJSON...');
                geoJson = toGeoJson.gpx(xml);
                log('...success');
                fileName = key.substring(0, key.lastIndexOf('.'));
                newFileName = fileName + ".json";
                log("Putting " + newFileName + " to S3...");
                return [4 /*yield*/, s3.putObject({
                        Bucket: "" + record.s3.bucket.name,
                        Key: newFileName,
                        Body: JSON.stringify(geoJson),
                        ContentType: "application/vnd.geo+json, application/json"
                    })];
            case 3:
                putResponse = _b.sent();
                log('...success');
                context.succeed("Successfully wrote " + newFileName);
                _b.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 1];
            case 5: return [2 /*return*/];
        }
    });
}); };
//# sourceMappingURL=index.js.map