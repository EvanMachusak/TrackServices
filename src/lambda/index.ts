import aws = require('aws-sdk');
import promisify = require("es6-promisify");
import xmldom = require('xmldom');
const domParser = new xmldom.DOMParser();
import toGeoJson = require('@mapbox/togeojson');

const log = (process.env.suppressLogs || false) 
    ? console.log 
    : (message) => {};

type s3promise = {
    getObject: (req: aws.S3.GetObjectRequest) => Promise<aws.S3.GetObjectOutput>;
    putObject: (req: aws.S3.PutObjectRequest) => Promise<aws.S3.PutObjectOutput>;
};
function newS3(): s3promise {
    let s3 = new aws.S3();
    let asPromised: s3promise = {
        getObject: promisify(s3.getObject.bind(s3)),
        putObject: promisify(s3.putObject.bind(s3))
    };
    return asPromised;
}

export const handler = async (event, context, callback) => {
    let s3 = newS3();
    for (let record of (event.Records || [])) {
        let bucket = record.s3.bucket.name;
        let key = record.s3.object.key;
        log(`Attempting to get objecct from bucket ${bucket} with key ${key}...`);
        let sourceObject = await s3.getObject({
            Bucket: bucket,
            Key: key,
        });
        let body = String(sourceObject.Body || '');
        log(`...success.  Received a body of length ${body.length}`);
        log('Parsing as XML...');
        let xml = domParser.parseFromString(body);
        log('...success');
        log('Converting to GeoJSON...');
        let geoJson = toGeoJson.gpx(xml);
        log('...success');
        let fileName = key.substring(0, key.lastIndexOf('.'));
        let newFileName = `${fileName}.json`;
        log(`Putting ${newFileName} to S3...`);
        let putResponse = await s3.putObject({
            Bucket: `${record.s3.bucket.name}`,
            Key: newFileName,
            Body: JSON.stringify(geoJson),
            ContentType: "application/vnd.geo+json, application/json"
        });
        log('...success');
        context.succeed(`Successfully wrote ${newFileName}`);
    }
};