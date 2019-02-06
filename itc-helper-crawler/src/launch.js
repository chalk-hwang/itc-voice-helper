require('dotenv').config();
const consumer = require('consumer').default;

(async () => {
  const { consumerServer, consumerCluster } = await consumer();

  process.on('SIGTERM', () => {
    try {
      consumerServer.stop();
      consumerCluster.close().then(() => {
        process.exit();
      });
    } catch (e) {
      console.log(e);
      process.exit(1);
    }
  });

  process.on('SIGHUP', () => {
    try {
      consumerServer.stop();
      consumerCluster.close().then(() => {
        process.exit();
      });
    } catch (e) {
      console.log(e);
      process.exit(1);
    }
  });

  process.on('SIGINT', () => {
    try {
      consumerServer.stop();
      consumerCluster.close().then(() => {
        process.exit();
      });
    } catch (e) {
      console.log(e);
      process.exit(1);
    }
  });
})();
