import AWS from 'aws-sdk';

const sqs = new AWS.SQS({ region: 'ap-northeast-2' });

const sendQueue = async (attributes, body, delay = 0) => {
  const params = {
    DelaySeconds: delay,
    MessageAttributes: attributes,
    MessageBody: body,
    QueueUrl: process.env.SQS_QUEUE_URL,
  };
  console.log(params);
  return sqs.sendMessage(params).promise();
};

export default sendQueue;
