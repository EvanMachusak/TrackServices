"use strict";
var _this = this;
exports.__esModule = true;
var tslib_1 = require("tslib");
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
        return new Promise(function (resolve, reject) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _this = this;
            var body, postHandler, gpxPath, gpx, _a, _b;
            return tslib_1.__generator(this, function (_c) {
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
                            .end(function (error, response) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                            var geoJsonPath, geoJson, bodyJson, error_1;
                            return tslib_1.__generator(this, function (_a) {
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