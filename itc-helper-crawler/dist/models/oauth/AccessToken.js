"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _dynamoose = _interopRequireDefault(require("dynamoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const AccessTokenSchema = new _dynamoose.default.Schema({
  accessToken: {
    type: String,
    hashKey: true
  },
  accessTokenExpiresAt: {
    type: Date
  },
  client: {
    type: Object
  },
  clientId: {
    type: String
  },
  user: {
    type: Object
  },
  userId: {
    type: String
  },
  scope: {
    type: String
  }
}, {
  expires: {
    ttl: 7 * 24 * 60 * 60,
    attribute: 'accessTokenExpiresAt'
  }
});

const AccessToken = _dynamoose.default.model(process.env.DYNAMODB_TABLE_ACCESS_TOKEN, AccessTokenSchema);

var _default = AccessToken;
exports.default = _default;