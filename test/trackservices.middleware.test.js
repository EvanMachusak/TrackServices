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
exports.__esModule = true;
require("mocha");
var uuid = require("uuid/v4");
var jsonMinify = require("jsonminify");
var chai = require("chai");
var chaiThings = require("chai-things");
var chaiHttp = require("chai-http");
var promisify = require("es6-promisify");
var fs = require("fs");
var path = require("path");
var readFile = promisify(fs.readFile);
var writeFile = promisify(fs.writeFile);
var expect = chai.expect;
var assert = chai.assert;
chai.use(chaiThings);
chai.use(chaiHttp);
global.Should = require('chai').Should();
var express = require("express");
var fileUpload = require("express-fileupload");
var TrackServices = require("../src/trackservices.middleware");
var server = express();
server.use(fileUpload())
    .listen(3031);
describe("Tracking services", function () {
    it("should return a status 200", function () {
        var url = "/" + uuid();
        return new Promise(function (resolve) {
            var postHandler = function (geo) {
                return { status: 200 };
            };
            server.use(url, TrackServices.post(postHandler));
            chai.request(server)
                .post(url)
                .send({})
                .end(function (error, response) {
                expect(response).property("statusCode").to.equal(200);
                resolve();
            });
        });
    });
    it("should respond with a body", function () {
        var url = "/" + uuid();
        return new Promise(function (resolve) {
            var body = { key: 'value' };
            var postHandler = function (geo) {
                return {
                    status: 200,
                    body: body
                };
            };
            server.use(url, TrackServices.post(postHandler));
            chai.request(server)
                .post(url)
                .send({})
                .end(function (error, response) {
                expect(response).property("statusCode").to.equal(200);
                expect(response.body).is.not["null"];
                expect(response.body).is.not.undefined;
                expect(response.body).has.property("key");
                expect(response.body).property("key").equals(body.key);
                resolve();
            });
        });
    });
    it("should convert gpx to geojson", function () {
        var url = "/" + uuid();
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            var body, postHandler, gpxPath, gpx, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        body = { key: 'value' };
                        postHandler = function (request) {
                            return {
                                status: 200,
                                body: request.geo
                            };
                        };
                        server.use(url, TrackServices.post(postHandler));
                        gpxPath = path.join(__dirname, "data/run.gpx");
                        _a = Buffer.bind;
                        return [4 /*yield*/, readFile(gpxPath)];
                    case 1:
                        gpx = new (_a.apply(Buffer, [void 0, _c.sent()]))();
                        chai.request(server)
                            .post(url)
                            .attach("gpxField", gpx, "run.gpx")
                            .end(function (error, response) { return __awaiter(_this, void 0, void 0, function () {
                            var geoJsonPath, geoJson, bodyJson, error_1;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        _a.trys.push([0, 2, , 3]);
                                        expect(response).property("statusCode").to.equal(200);
                                        expect(response.body).is.not["null"];
                                        expect(response.body).is.not.undefined;
                                        geoJsonPath = path.join(__dirname, "data/run.gpx.json");
                                        return [4 /*yield*/, readFile(geoJsonPath, "utf8")];
                                    case 1:
                                        geoJson = _a.sent();
                                        geoJson = jsonMinify(geoJson);
                                        bodyJson = JSON.stringify(response.body);
                                        bodyJson = jsonMinify(bodyJson);
                                        expect(geoJson).equals(bodyJson);
                                        // let outputPath = path.join(__dirname, "output/run.gpx.json");
                                        // await writeFile(outputPath, bodyJson);
                                        resolve();
                                        return [3 /*break*/, 3];
                                    case 2:
                                        error_1 = _a.sent();
                                        reject(error_1);
                                        return [3 /*break*/, 3];
                                    case 3: return [2 /*return*/];
                                }
                            });
                        }); });
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=trackservices.middleware.test.js.map