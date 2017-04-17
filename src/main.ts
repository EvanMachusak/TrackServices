import express = require('express');
import * as TrackServices from './trackservices.middleware';

const postHandler = geo => { 
    return { status: 200 };
};
const app = express()
    .use('/activity', TrackServices.post(postHandler));

