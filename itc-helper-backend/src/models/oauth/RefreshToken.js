import dynamoose, { Schema } from 'dynamoose';

if (process.env.NODE_ENV === 'development') {
  dynamoose.local('http://localhost:8000');
}

const RefreshTokenSchema = new dynamoose.Schema(
  {
    refreshToken: {
      type: String,
      hashKey: true,
    },
    refreshTokenExpiresAt: {
      type: Date,
    },
    client: {
      type: Object,
    },
    clientId: {
      type: String,
    },
    user: {
      type: Object,
    },
    userId: {
      type: String,
    },
    scope: {
      type: String,
    },
  },
  {
    expires: {
      ttl: 7 * 24 * 60 * 60,
      attribute: 'refreshTokenExpiresAt',
    },
  },
);

const AccessToken = dynamoose.model(
  process.env.REFRESH_TOKEN_DYNAMODB_TABLE,
  RefreshTokenSchema,
);

export default AccessToken;