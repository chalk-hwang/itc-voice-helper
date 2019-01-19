import Router from 'koa-router';

import * as oauthCtrl from './oauth.ctrl';

const oauth = new Router();
oauth.post('/login', oauthCtrl.login);
oauth.post('/register', oauthCtrl.register);
oauth.get('/token', oauthCtrl.getToken);
oauth.get('/getClient', oauthCtrl.getClient);

export default oauth;
