import express = require('express');
import toGeoJson = require('@mapbox/togeojson');
import xmldom = require('xmldom');
const domParser = new xmldom.DOMParser();
import 'geojson';

export interface GeoRequestProperties {
    sourceFormat: "tcx" | "gpx" | "kml";
    sourceFileName: string;
    geo: GeoJSON.GeometryObject;
}
export interface GeoRequest extends express.Request, GeoRequestProperties {}
export type PostHandler = (request: GeoRequest) => {
    status: number,
    body?: any;
    contentType?: string;
};
export type PostHandlerFactory = (handler: PostHandler) => express.Handler;

export const post: PostHandlerFactory = (handler: PostHandler) => {
    let expressHandler = (request: express.Request, response: express.Response, next?: express.NextFunction) => {
        let method = (request.method || "").toLocaleLowerCase();
        let requestFiles = (<any>request).files;
        let files = [];
        for(let key in requestFiles)
            files.push(requestFiles[key]);
        let geoProps: GeoRequestProperties  = {
            sourceFileName: "test.gpx",
            sourceFormat: "gpx",
            geo: undefined
        };

        if (files && files.length == 1) {
            let fileBuffer: Buffer = files[0].data;
            let xml = domParser.parseFromString(fileBuffer.toString("utf8"));
            let geoJson = toGeoJson.gpx(xml);
            geoProps.geo = geoJson;
        }
        else if (files && files.length > 1) {
            response.json("At most 1 file should be included in this request");
            response.end;
            return;
        }
        let geoRequest = <GeoRequest>{ ...request, ...geoProps };
        
        let handlerResult = handler(geoRequest);
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
