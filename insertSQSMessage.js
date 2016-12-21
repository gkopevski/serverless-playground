'use strict';

const AWS = require('aws-sdk');
const SQS = new AWS.SQS({ region: process.env.region });
const SqsMessageGeneric = require('./models/aws/sqsMessageGeneric');

module.exports.insert = (event, context, callback) => {
  let response = {
    OK: {
      statusCode: 200,
      body: {
        message: 'Success in inserting in SQS queue',
      },
    },
    ERROR: {
      statusCode: 400,
      body: {
        message: 'Error while trying to insert message in SQS queue',
      },
    },
  };

  try {
    let sqsMessage = new SqsMessageGeneric(SQS, undefined, 0);
    sqsMessage.putInQueue(event.body, (err, data) => {
      if (err) {
        response.ERROR.errorLog = err;
        callback(null, response.ERROR);
      }
      // else {
      //   callback(null, response.OK);
      // }
    });
  } catch (e) {
    callback(null, e);
  }
};
