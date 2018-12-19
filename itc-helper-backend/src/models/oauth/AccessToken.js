import dynamoose from 'dynamoose';

if (process.env.NODE_ENV === 'development') {
  dynamoose.local('http://localhost:8000');
}
const AccessTokenSchema = new dynamoose.Schema(
  {
    accessToken: {
      type: String,
      hashKey: true,
    },
    accessTokenExpiresAt: {
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
      attribute: 'accessTokenExpiresAt',
    },
  },
);

const AccessToken = dynamoose.model(
  process.env.ACCESS_TOKEN_DYNAMODB_TABLE,
  AccessTokenSchema,
);

export default AccessToken;
