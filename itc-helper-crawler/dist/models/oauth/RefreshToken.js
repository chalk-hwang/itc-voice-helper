"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _dynamoose = _interopRequireDefault(require("dynamoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const RefreshTokenSchema = new _dynamoose.default.Schema({
  refreshToken: {
    type: String,
    hashKey: true
  },
  refreshTokenExpiresAt: {
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
    attribute: 'refreshTokenExpiresAt'
  }
});

const RefreshToken = _dynamoose.default.model(process.env.DYNAMODB_TABLE_REFRESH_TOKEN, RefreshTokenSchema);

var _default = RefreshToken;
exports.default = _default;