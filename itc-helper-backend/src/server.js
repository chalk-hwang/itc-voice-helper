import Koa from 'koa';
import serverless from 'serverless-http';
import koaBody from 'koa-body';
import logger from 'koa-logger';
import cors from '@koa/cors';
import OAuthServer from 'lib/oauth';
import router from './router';

const whitelist = [
  'https://api.itc-helper.dguri.io',
  'https://prod-ni-cic.clova.ai/v1/al/token',
];

export default class Server {
  constructor() {
    this.app = new Koa();
    this.middleware();
  }

  middleware() {
    const { app } = this;
    app.context.oauth = OAuthServer();
    app.use(logger());
    app.use(
      cors({
        origin: (ctx) => {
          const requestOrigin = ctx.accept.headers.origin;
          if (!whitelist.includes(requestOrigin)) {
            return ctx.throw(requestOrigin);
          }
          return requestOrigin;
        },
        credentials: true,
      }),
    );
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
