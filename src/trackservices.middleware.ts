import express = require('express');
import toGeoJson = require('@mapbox/togeojson');
import fs = require('fs');
import xmldom = require('xmldom');
const domParser = xmldom.DOMParser;
import 'geojson';

export interface GeoRequestProperties {
    sourceFormat: "tcx" | "gpx" | "kml";
    sourceFileName: string;
    geo: GeoJSON.GeometryObject;
}
export interface GeoRequest extends express.Request, GeoRequestProperties {}
export type PostHandler = (request: GeoRequest) => {
    status: number,
    responseBody?: any;
    contentType?: string;
};
export type PostHandlerFactory = (handler: PostHandler) => express.Handler;

export const post: PostHandlerFactory = (handler: PostHandler) => {
    let expressHandler = (request: express.Request, response: express.Response, next?: express.NextFunction) => {
        let method = (request.method || "").toLocaleLowerCase();
        if (method == "post") {
            let geoProps: GeoRequestProperties = {
                sourceFileName: "test.gpx",
                sourceFormat: "gpx",
                geo: undefined
            };
            let geoRequest = <GeoRequest>{ ...request, ...geoProps };
            
            let handlerResult = handler(geoRequest);
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
