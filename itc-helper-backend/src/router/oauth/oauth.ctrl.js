import Joi from 'joi';
import sendQueue from 'lib/sendQueue';
import * as passwordHash from 'lib/passwordHash';
import User from 'models/User';
import LocalClientRegistry from 'config/ClientRegistry';
import { generate } from 'lib/token';

export const getClient = async (ctx) => {
  const { client_id: clientId, scope, redirect_uri: redirectUri } = ctx.query;

  if (!clientId || !scope || !redirectUri) {
    ctx.status = 400;
    ctx.body = {
      name: 'WRONG_QUERY_STRING',
      payload: ctx.query,
    };
    return;
  }

  const client = LocalClientRegistry.clients[clientId];

  if (!client) {
    ctx.status = 400;
    ctx.body = {
      name: 'WRONG_CLIENT_ID',
      payload: ctx.query,
    };
    return;
  }

  if (!client.redirectUris.includes(redirectUri)) {
    ctx.status = 400;
    ctx.body = {
      name: 'WRONG_REDIRECT_URI',
      payload: ctx.query,
    };
    return;
  }

  const scopes = scope.split(',').map(s => (client.scope.indexOf(s) > -1) && LocalClientRegistry.scopes[s]).filter(Boolean);

  ctx.body = {
    name: client.name,
    image: client.image,
    scopes,
  };
};

export const login = async (ctx) => {
  const schema = Joi.object().keys({
    form: Joi.object().keys({
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string()
        .required(),
    }),
  });
  const result = Joi.validate(ctx.request.body, schema);

  if (result.error) {
    ctx.status = 400;
    ctx.body = {
      name: 'WRONG_SCHEMA',
      payload: result.error,
    };
    return;
  }
  try {
    const { form: { email, password } } = ctx.request.body;
    const user = await User.queryOne({
      email: { eq: email },
    }).exec();

    if (!user) {
      ctx.status = 401;
      return;
    }

    const passwordVeify = await passwordHash.verify(user.password, password);
    if (!passwordVeify) {
      ctx.status = 404;
      return;
    }

    if (!user.studentValidate) {
      ctx.status = 401;
      return;
    }
    const tokenData = {
      id: user.id,
      email: user.email,
      studentId: user.studentId,
      name: user.name,
      department: user.department,
      status: user.status,
      grade: user.grade,
    };

    const token = await generate({
      user: tokenData,
    });

    ctx.cookies.set('access_token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
      domain: process.env.NODE_ENV === 'development' ? undefined : '.dguri.io',
    });

    ctx.body = {
      user: tokenData,
      token,
    };
  } catch (e) {
    ctx.throw(500, e);
  }
  // ctx.cookies.set('access_token',)
};

export const check = async (ctx) => {
  if (!ctx.user) {
    ctx.status = 401;
    return;
  }

  try {
    const now = new Date();
    const user = await User.get({ id: ctx.user.id });
    if (!user) {
      // $FlowFixMe: intersection bug
      ctx.cookies.set('access_token', null, {
        domain: process.env.NODE_ENV === 'development' ? undefined : '.dguri.io',
      });
      ctx.status = 401;
      return;
    }
    const tokenData = {
      id: user.id,
      email: user.email,
      studentId: user.studentId,
      name: user.name,
      department: user.department,
      status: user.status,
      grade: user.grade,
    };

    if (ctx.tokenExpire - now < 1000 * 60 * 60 * 24 * 4) {
      const token = await generate({
        user: tokenData,
      });

      ctx.cookies.set('access_token', token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        domain: process.env.NODE_ENV === 'development' ? undefined : '.dguri.io',
      });
    }

    ctx.body = {
      user: tokenData,
    };
  } catch (e) {
    ctx.throw(500, e);
  }
};


const authenticateHandler = () => {
  return {
    handle: (request, response) => {
      return request.user;
    },
  };
};

export const authorize = async (ctx, next) => {
  ctx.request.user = ctx.user;
  return ctx.oauth.authorize({
    authenticateHandler: authenticateHandler(),
  })(ctx, next);
};

export const register = async (ctx) => {
  const schema = Joi.object().keys({
    form: Joi.object().keys({
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string()
        .required()
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,}$/),
      studentId: Joi.string()
        .required()
        .min(8),
      studentPw: Joi.string().required(),
    }),
  });

  const result = Joi.validate(ctx.request.body, schema);

  if (result.error) {
    ctx.status = 400;
    ctx.body = {
      name: 'WRONG_SCHEMA',
      payload: result.error,
    };
    return;
  }

  const {
    form: {
      email, password, studentId, studentPw,
    },
  } = ctx.request.body;
  try {
    const [emailExists, studentIdExists] = await Promise.all([
      User.queryOne({
        email: { eq: email },
      }).exec(),
      User.queryOne({
        studentId: { eq: studentId },
      }).exec(),
    ]);

    if (emailExists || studentIdExists) {
      ctx.status = 409;
      ctx.body = {
        name: 'DUPLICATED_ACCOUNT',
        payload: emailExists ? 'email' : 'studentId',
      };
      return;
    }
  } catch (e) {
    console.log(e);
  }

  try {
    const passwordHashed = await passwordHash.hash(password);
    const user = new User({
      email,
      password: passwordHashed,
      studentId,
      studentPw,
    });
    await user.save();
    await sendQueue(
      {
        Type: {
          DataType: 'String',
          StringValue: 'StudentIdentityCheck',
        },
        UserId: {
          DataType: 'String',
          StringValue: user.id,
        },
        UserStudentId: {
          DataType: 'String',
          StringValue: user.studentId,
        },
        UserStudentPw: {
          DataType: 'String',
          StringValue: user.studentPw,
        },
      },
      'test',
    );
    ctx.body = {
      user: {
        id: user.id,
        email: user.email,
        studentId: user.studentId,
        studentValidate: user.studentValidate,
      },
    };
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const getToken = async (ctx, next) => {
  return ctx.oauth.token()(ctx, next);
};
