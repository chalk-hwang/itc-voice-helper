export default (ctx, next) => {
  if (ctx.request.url === '/oauth/token') return next();
  ctx.set('Access-Control-Allow-Origin', 'https://itc-helper.dguri.io');
  if (
    ctx.headers.referer
    && ctx.headers.referer.indexOf('localhost:3000') > -1
  ) {
    ctx.set('Access-Control-Allow-Origin', 'http://localhost:3000');
  }
  ctx.set('Access-Control-Allow-Credentials', true);
  return next();
};
