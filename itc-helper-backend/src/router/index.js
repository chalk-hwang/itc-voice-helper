import Router from 'koa-router';
import oauth from './oauth';
import clova from './clova';

const router = new Router();
router.use('/oauth', oauth.routes());
router.use('/clova', clova.routes());

router.get('/check', (ctx) => {
  console.log('avoiding cold start...');
  ctx.body = {
    version: '1.0.0-alpha.0',
    origin: ctx.origin,
    env: process.env.NODE_ENV,
  };
});

export default router;
