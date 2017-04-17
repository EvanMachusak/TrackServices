"use strict";
exports.__esModule = true;
require("mocha");
var chai = require("chai");
var chaiThings = require("chai-things");
var chaiHttp = require("chai-http");
var expect = chai.expect;
var assert = chai.assert;
chai.use(chaiThings);
chai.use(chaiHttp);
global.Should = require('chai').Should();
var express = require("express");
var TrackServices = require("../src/trackservices.middleware");
describe("Tracking services", function () {
    it("should parse a gpx file successfully", function () {
        debugger;
        return new Promise(function (resolve) {
            var postHandler = function (geo) {
                return { status: 200 };
            };
            var server = express()
                .use('/activity', TrackServices.post(postHandler))
                .listen(3030, function () {
            });
            chai.request(server)
                .post('/activity')
                .send({})
                .end(function (error, response) {
                expect(response).property("statusCode").to.equal(200);
                resolve();
            });
        });
    });
});
//# sourceMappingURL=trackservices.middleware.test.js.map