import Router from 'koa-router';
import camelcase from 'camelcase';

import * as clovaCtrl from './clova.ctrl';

const clova = new Router();

clova.get('/', (ctx) => {
  ctx.body = {
    message: '정상적으로 작동합니다.',
  };
});

clova.post('/', async (ctx) => {
  const { request, session, context } = ctx.request.body;
  console.log(JSON.stringify(ctx.request.body));
  try {
    switch (request.type) {
      case 'LaunchRequest':
      case 'SessionEndedRequest':
        ctx.body = await clovaCtrl[camelcase(request.type)](
          request,
          session,
          context,
        );
        break;
      case 'IntentRequest':
        try {
          console.log(camelcase(request.intent.name));
          ctx.body = await clovaCtrl[camelcase(request.intent.name)](
            request,
            session,
            context,
          );
        } catch (e) {
          console.error(e);
          ctx.body = await clovaCtrl.notFound(request, session);
        }
        break;
      default:
        ctx.throw(400);
        break;
    }
  } catch (e) {
    ctx.throw(400, e);
  }
});

export default clova;
