'use strict';

const AWS = require('aws-sdk');

const SQS = new AWS.SQS({ region: process.env.region });
const Lambda = new AWS.Lambda({ region: process.env.region });
const SQSMessageGenericProvider = require('./../models/aws/sqsMessageGeneric');

const invokeWorker = (message) => {
  try {
    Lambda.invoke({
      FunctionName: 'staging-SQS-worker',
      InvocationType: 'Event',
      Payload: JSON.stringify(message),
    }, function (error, data) {
      if (error) {
        console.log('invokeWorker:error', JSON.stringify(error));
      } else {
        console.log('invokeWorker:success', JSON.stringify(data));

      }
    });
  } catch (e) {
    console.log('Error while invoking worker: ' + JSON.stringify(e));
  }
};

const consume = () => {
  try {
    let messages = new SQSMessageGenericProvider(SQS, process.env.taskQueue, 2);
    console.log('messages: ' + JSON.stringify(messages));
    messages.onReceive((err, receivedMessages) => {
      if (err) {
        console.log('Error occured when trying to read messages from SQS queue: '
            + JSON.stringify(err));
      } else {
        if (receivedMessages && receivedMessages.length > 0) {
          receivedMessages.forEach((message) => {
            console.log('Message ' + JSON.stringify(message));
            invokeWorker(message);
            messages.removeFromQueue(message);
          });
        }
      }
    });
  } catch (e) {
    console.log('Error while processing message: ' + JSON.stringify(e));
  }
};

module.exports.consume = consume;
