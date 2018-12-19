import jwt from 'jsonwebtoken';

const { SECRET_KEY: secret } = process.env;

export const generate = (payload, options) => {
  const jwtOptions = {
    issuer: 'itc-helper.dguri.io',
    expiresIn: '7d',
    ...options,
  };

  if (!jwtOptions.expiresIn) {
    delete jwtOptions.expiresIn;
  }

  return new Promise((resolve, reject) => {
    jwt.sign(payload, secret, jwtOptions, (err, token) => {
      if (err) reject(err);
      resolve(token);
    });
  });
};

export const decode = (token) => {
  return new Promise((resolve, reject) => {
    if (!secret) throw new Error('jwt secret missing');
    jwt.verify(token, secret, (err, decoded) => {
      if (err) reject(err);
      resolve(decoded);
    });
  });
};
