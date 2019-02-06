import dynamoose from 'dynamoose';

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
  process.env.DYNAMODB_TABLE_ACCESS_TOKEN,
  AccessTokenSchema,
);

export default AccessToken;
