import NodeOAuthServer, {
  Request,
  Response,
  InvalidArgumentError,
  UnauthorizedRequestError,
} from 'oauth2-server';

/**
 * Handle response.
 */
const handleResponse = async function (ctx, response) {
  if (response.status === 302) {
    const { location } = response.headers;
    delete response.headers.location;
    ctx.set(response.headers);
    ctx.redirect(location);
  } else {
    ctx.set(response.headers);
    ctx.status = response.status;
    ctx.body = response.body;
  }
};

/**
 * Handle error.
 */

const handleError = async function (e, ctx, response, next) {
  if (this.useErrorHandler === true) {
    ctx.state.oauth = { error: e };
    await next();
  } else {
    if (response) {
      ctx.set(response.headers);
    }

    ctx.status = e.code;

    if (e instanceof UnauthorizedRequestError) {
      ctx.body = '';
      return;
    }

    ctx.body = { error: e.name, error_description: e.message };
  }
};

class KoaOAuthServer {
  constructor(options) {
    options = options || {};

    if (!options.model) {
      throw new InvalidArgumentError('Missing parameter: `model`');
    }

    this.useErrorHandler = !!options.useErrorHandler;
    delete options.useErrorHandler;

    this.continueMiddleware = !!options.continueMiddleware;
    delete options.continueMiddleware;

    this.server = new NodeOAuthServer(options);
  }

  authenticate(options) {
    const that = this;

    return async function (ctx, next) {
      const request = new Request(ctx.request);
      const response = new Response(ctx.response);
      let token;

      try {
        token = await that.server.authenticate(request, response, options);
        ctx.state.oauth = { token };
      } catch (e) {
        await handleError.call(that, e, ctx, null, next);
        return;
      }

      await next();
    };
  }

  authorize(options) {
    const that = this;

    return async function (ctx, next) {
      const request = new Request(ctx.request);
      const response = new Response(ctx.request);
      let code;

      try {
        code = await that.server.authorize(request, response, options);
        ctx.state.oauth = { code };
      } catch (e) {
        await handleError.call(that, e, ctx, response, next);
        return;
      }

      if (that.continueMiddleware) {
        await next();
      }

      await handleResponse.call(that, ctx, response);
    };
  }

  token(options) {
    const that = this;

    return async function (ctx, next) {
      const request = new Request(ctx.request);
      const response = new Response(ctx.response);
      let token;

      try {
        token = await that.server.token(request, response, options);
        ctx.state.oauth = { token };
      } catch (e) {
        await handleError.call(that, e, ctx, response, next);
        return;
      }

      if (that.continueMiddleware) {
        await next();
      }

      await handleResponse.call(that, ctx, response);
    };
  }
}

export default KoaOAuthServer;
