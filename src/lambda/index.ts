import * as lambda from 'aws-lambda';
import aws = require('aws-sdk');
import promisify = require("es6-promisify");
import xmldom = require('xmldom');
const domParser = new xmldom.DOMParser();
import toGeoJson = require('@mapbox/togeojson');


type s3promise = {
    getObject: (req: aws.S3.GetObjectRequest) => Promise<aws.S3.GetObjectOutput>;
    putObject: (req: aws.S3.PutObjectRequest) => Promise<aws.S3.PutObjectOutput>;
};
function newS3(): s3promise {
    let s3 = new aws.S3();
    let asPromised: s3promise = {
        getObject: promisify(s3.getObject),
        putObject: promisify(s3.putObject)
    };
    return asPromised;
}

export const handler: lambda.Handler = async (event: lambda.S3CreateEvent, context, callback) => {
    let s3 = newS3();
    for (let record of (event.Records || [])) {
        let sourceObject = await s3.getObject({
            Bucket: record.s3.bucket.name,
            Key: record.s3.object.key,
        });
        let xml = domParser.parseFromString(String(sourceObject.Body));
        let geoJson = toGeoJson.gpx(xml);
        let key = record.s3.object.key;
        let fileName = key.substring(0, key.lastIndexOf('.'));
        let newFileName = `${fileName}.json`;
        let putResponse = await s3.putObject({
            Bucket: `${record.s3.bucket.name}-out`,
            Key: newFileName,
            Body: JSON.stringify(geoJson),
            ContentType: "application/vnd.geo+json, application/json"
        });
        context.done();
    }
};