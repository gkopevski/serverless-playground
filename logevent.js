'use strict';

const AWS = require('aws-sdk');
const DynamoDB = new AWS.DynamoDB();

module.exports.logevent = (event, context, callback) => {

  let response = {
    OK: {
      statusCode: 200,
      body: {
        message: 'Success in logging when you have made access to this service',
        methodType: event.httpMethod,
      },
    },
    ERROR: {
      statusCode: 400,
      body: {
        message: 'Error while trying to access the service',
      },
    },
  };

  const postLogEvent = () => {
    let model = {
      timeCreated: {
        S: new Date().getTime() + '',
      },
      path: {
        S: event.path,
      },
      sourceIP: {
        S: event.requestContext.identity.sourceIp,
      },
    };

    DynamoDB.putItem({
      TableName: 'logRequestTable',
      Item: model,
    }, function (err, data) {
      if (err) {
        response.ERROR.errorLog = err;
        callback(null, response.ERROR);
      } else {
        callback(null, response.OK);
      }
    });
  };

  const getLogEventList = () => {
    DynamoDB.scan({
      TableName: 'logRequestTable',
    }, (err, data) => {
      if (err) {
        response.ERROR.errorLog = err;
        callback(null, response.ERROR);
      } else {
        response.OK.headers = {};
        response.OK.body.data = data;
        response.OK.body = JSON.stringify(response.OK.body);
        context.succeed(response.OK);
      }
    });
  };

  try {
    switch (event.httpMethod){
      case 'GET':
        getLogEventList();
        break;
      case 'POST':
        postLogEvent();
        break;
      default:
        context.fail(new Error('Unrecognized operation "' + event.httpMethod + '"'));
        break;
    }
  } catch (e) {
    callback(null, e);
  }

};
