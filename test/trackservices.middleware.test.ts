import 'mocha';
import uuid = require('uuid/v4');
import jsonMinify = require('jsonminify');
import chai = require('chai');
import chaiThings = require('chai-things');
import chaiHttp = require('chai-http');
import promisify = require("es6-promisify");
import fs = require("fs");
import path = require("path");
const readFile: (filename: string, encoding?: string) => Promise<string> = promisify(fs.readFile);
const writeFile: (filename: string, data: any) => Promise<void> = promisify(fs.writeFile);
const expect = chai.expect;
const assert = chai.assert;
chai.use(chaiThings);
chai.use(chaiHttp);
(<any>global).Should = require('chai').Should();

import express = require('express');
import fileUpload = require('express-fileupload');
import * as TrackServices from '../src/trackservices.middleware';

const server = express();
server.use(fileUpload())
    .listen(3031);
            
describe("Tracking services", () => {
    it("should return a status 200", () => {
        let url = `/${uuid()}`;
        return new Promise<void>(resolve => {
            let postHandler = geo => {
                return { status: 200 }
            };
            server.use(url, TrackServices.post(postHandler));
            chai.request(server)
                .post(url)
                .send({})
                .end((error, response) => {
                    expect(response).property("statusCode").to.equal(200);
                    resolve();
                });
        });
    });
    it("should respond with a body", () => {
        let url = `/${uuid()}`;
        return new Promise<void>(resolve => {
            let body = { key: 'value' };
            let postHandler = geo => {
                return {
                    status: 200,
                    body: body,
                }
            };
            server.use(url, TrackServices.post(postHandler));
            chai.request(server)
                .post(url)
                .send({})
                .end((error, response) => {
                    expect(response).property("statusCode").to.equal(200);
                    expect(response.body).is.not.null;
                    expect(response.body).is.not.undefined;
                    expect(response.body).has.property("key");
                    expect(response.body).property("key").equals(body.key);
                    resolve();
                });
        });
    });
    it("should convert gpx to geojson", () => {
        let url = `/${uuid()}`;
        return new Promise<void>(async (resolve, reject) => {
            let body = { key: 'value' };
            let postHandler = (request: TrackServices.GeoRequest) => {
                return {
                    status: 200,
                    body: request.geo,
                }
            };
            server.use(url, TrackServices.post(postHandler));
            let gpxPath = path.join(__dirname, "data/run.gpx");
            let gpx = new Buffer(await readFile(gpxPath));
            chai.request(server)
                .post(url)
                .attach("gpxField", gpx, "run.gpx")
                .end(async (error, response) => {
                    try {
                        expect(response).property("statusCode").to.equal(200);
                        expect(response.body).is.not.null;
                        expect(response.body).is.not.undefined;
                        let geoJsonPath = path.join(__dirname, "data/run.gpx.json");
                        let geoJson = await readFile(geoJsonPath, "utf8");
                        geoJson = jsonMinify(geoJson);
                        let bodyJson = JSON.stringify(response.body);
                        bodyJson = jsonMinify(bodyJson);     
                        expect(geoJson).equals(bodyJson);                   
                        // let outputPath = path.join(__dirname, "output/run.gpx.json");
                        // await writeFile(outputPath, bodyJson);
                        resolve();
                    } 
                    catch(error) {
                        reject(error);
                    }
                });
        });
    });
});