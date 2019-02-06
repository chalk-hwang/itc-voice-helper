import Consumer from 'sqs-consumer';
import { Cluster } from 'puppeteer-cluster';
import studentIdentityCheck from 'crawlers/studentIdentityCheck';

const {
  PUPPETEER_CLUSTER_HEADLESS,
  PUPPETEER_CLUSTER_MONITOR,
  SQS_QUEUE_URL,
} = process.env;

const consumer = async () => {
  const cluster = await Cluster.launch({
    concurrency: Cluster.CONCURRENCY_CONTEXT,
    maxConcurrency: 2,
    monitor: PUPPETEER_CLUSTER_MONITOR === 'true',
    puppeteerOptions: {
      headless: PUPPETEER_CLUSTER_HEADLESS === 'true',
    },
  });

  cluster.on('taskerror', (err, data) => {
    let reData = data;
    if (typeof data === 'object') {
      reData = JSON.stringify(data);
    }
    console.log(`Error crawling ${reData}: ${err.message}`);
  });

  const app = Consumer.create({
    queueUrl: SQS_QUEUE_URL,
    attributeNames: ['All'],
    messageAttributeNames: ['Type', 'UserId', 'UserStudentId', 'UserStudentPw'],
    handleMessage: (message, done) => {
      // do some work with `message`
      const { MessageAttributes } = message;
      const type = MessageAttributes.Type.StringValue;
      const userId = MessageAttributes.UserId.StringValue;
      const userStudentId = MessageAttributes.UserStudentId.StringValue;
      const userStudentPw = MessageAttributes.UserStudentPw.StringValue;
      cluster.queue(
        { userId, userStudentId, userStudentPw },
        studentIdentityCheck,
      );
      done();
    },
  });

  app.on('error', (err) => {
    console.log(err.message);
  });

  app.start();

  await cluster.idle();

  return {
    consumerServer: app,
    consumerCluster: cluster,
  };
};

export default consumer;
