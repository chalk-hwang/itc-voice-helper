import Koa from 'koa';
import serverless from 'serverless-http';
import koaBody from 'koa-body';
import logger from 'koa-logger';
import cors from 'lib/middlewares/cors';
import OAuthServer from 'lib/oauth';
import router from './router';

export default class Server {
  constructor() {
    this.app = new Koa();
    this.middleware();
  }

  middleware() {
    const { app } = this;
    app.context.oauth = OAuthServer();
    app.use(logger());
    app.use(cors);
    app.use(
      koaBody({
        multipart: true,
      }),
    );
    app.use(router.routes()).use(router.allowedMethods());
  }

  listen(port) {
    const { app } = this;
    app.listen(port);
    console.log('Listening to port', port);
  }

  serverless() {
    const { app } = this;
    return serverless(app);
  }
}
