import Joi from 'joi';
import sendQueue from 'lib/sendQueue';
import * as passwordHash from 'lib/passwordHash';
import User from 'models/User';

export const login = async (ctx) => {
  // ctx.cookies.set('access_token',)
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

export const getToken = async (ctx) => {
  ctx.body = ctx;
};
