import Router from 'koa-router';

import * as oauthCtrl from './oauth.ctrl';

const oauth = new Router();
oauth.post('/login', oauthCtrl.login);
oauth.get('/token', oauthCtrl.getToken);

export default oauth;
