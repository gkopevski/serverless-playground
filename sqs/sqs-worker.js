/**
 * Created by gkopevski on 12/16/16.
 */
'use strict';

const AWS = require('aws-sdk');
const DynamoDB = new AWS.DynamoDB({ region: process.env.region });

module.exports.work = (event, context) => {
  try {
    let model = {
      timeCreated: {
        S: event.Body,
      },
    };

    DynamoDB.putItem({
      TableName: 'logRequestTableBackup',
      Item: model,
    }, function (err, data) {
      if (err) {
        console.log('Error while inserting in DynamoDB ' + JSON.stringify(err));
      } else {
        console.log('Successfully inserted into DynamoDB');
      }
    });

  } catch (e) {
    console.log('Error while executing work ' + JSON.stringify(e));
  }
};