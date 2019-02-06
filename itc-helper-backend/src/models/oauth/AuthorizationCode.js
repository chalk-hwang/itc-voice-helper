import dynamoose from 'dynamoose';

const AuthorizationCodeSchema = new dynamoose.Schema(
  {
    authorizationCode: {
      type: String,
      hashKey: true,
    },
    expiresAt: {
      type: Date,
    },
    redirectUri: {
      type: String,
    },
    scope: {
      type: String,
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
  },
  {
    expires: {
      ttl: 7 * 24 * 60 * 60,
      attribute: 'expiresAt',
    },
  },
);

const AuthorizationCode = dynamoose.model(
  process.env.DYNAMODB_TABLE_AUTHORIZATION_CODE,
  AuthorizationCodeSchema,
);

export default AuthorizationCode;
