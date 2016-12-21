'use strict';

class SqsMessageGeneric {
  constructor(sqs, queueUrl, maxNumberOfMessages) {
    this.sqs = sqs;
    this.queueUrl = queueUrl || 'https://sqs.us-east-1.amazonaws.com/363191405432/example-playground-sync-task-queue-dev';
    this.maxNumberOfMessages = maxNumberOfMessages;
  }

  onReceive(callback) {
    this.sqs.receiveMessage({
      QueueUrl: this.queueUrl,
      MaxNumberOfMessages: this.maxNumberOfMessages,
      WaitTimeSeconds: 3,
      VisibilityTimeout: 60,
    }, function (err, data) {
      if (err) {
        console.error(err, err.stack);
        callback(err);
      } else {
        callback(null, data.Messages);
      }
    });
  }

  removeFromQueue(message) {
    this.sqs.deleteMessage({
      QueueUrl: this.queueUrl,
      ReceiptHandle: message.ReceiptHandle
    }, function (err, data) {
      err && console.log(err);
    });
  }

  // putInQueue(message) {
  //   this.sqs.sendMessage({
  //     QueueUrl: this.queueUrl,
  //     MessageBody: message,
  //   }).promise();
  // }

  putInQueue(message, callback) {
    this.sqs.sendMessage({
      QueueUrl: this.queueUrl,
      MessageBody: JSON.stringify(message),
    }, callback);
  }
}
module.exports = SqsMessageGeneric;