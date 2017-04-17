import 'mocha';
import chai = require('chai');
import chaiThings = require('chai-things');
import chaiHttp = require('chai-http');
let expect = chai.expect;
let assert = chai.assert;
chai.use(chaiThings);
chai.use(chaiHttp);
(<any>global).Should = require('chai').Should();


import express = require('express');
import * as TrackServices from '../src/trackservices.middleware';


describe("Tracking services", () => {
    it("should return a status 200", () => {
        return new Promise<void>(resolve => {
            let postHandler = geo => {
                return { status: 200 }
            };
            let server = express()
                .use('/activity', TrackServices.post(postHandler))
                .listen(3030, () => {
                });
            chai.request(server)
                .post('/activity')
                .send({})
                .end((error, response) => {
                    expect(response).property("statusCode").to.equal(200);
                    resolve();
                });
        });
    });
    it("should respond with a body", () => {
        return new Promise<void>(resolve => {
            let postHandler = geo => {
                return { status: 200 }
            };
            let server = express()
                .use('/activity', TrackServices.post(postHandler))
                .listen(3030, () => {
                });
            chai.request(server)
                .post('/activity')
                .send({})
                .end((error, response) => {
                    expect(response).property("statusCode").to.equal(200);
                    resolve();
                });
        });
    });

});