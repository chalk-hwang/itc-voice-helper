import Router from 'koa-router';

import * as oauthCtrl from './oauth.ctrl';

const oauth = new Router();
oauth.post('/login', oauthCtrl.login);
oauth.post('/register', oauthCtrl.register);
oauth.get('/token', oauthCtrl.getToken);
oauth.get('/getClient', oauthCtrl.getClient);
oauth.get('/check', oauthCtrl.check);
oauth.get('/authorize', oauthCtrl.authorize);
oauth.post('/token', oauthCtrl.getToken);
oauth.all('/*', async (ctx, next) => {
  const oauthState = ctx.state.oauth || {};

  if (oauthState.error) {
    // handle the error thrown by the oauth.authenticate middleware here
    ctx.throw(oauthState.error);
    return;
  }

  await next();
});

export default oauth;
