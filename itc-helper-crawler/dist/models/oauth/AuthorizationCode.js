"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _dynamoose = _interopRequireDefault(require("dynamoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const AuthorizationCodeSchema = new _dynamoose.default.Schema({
  authorizationCode: {
    type: String,
    hashKey: true
  },
  expiresAt: {
    type: Date
  },
  redirectUri: {
    type: String
  },
  scope: {
    type: String
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
  }
}, {
  expires: {
    ttl: 7 * 24 * 60 * 60,
    attribute: 'expiresAt'
  }
});

const AuthorizationCode = _dynamoose.default.model(process.env.DYNAMODB_TABLE_AUTHORIZATION_CODE, AuthorizationCodeSchema);

var _default = AuthorizationCode;
exports.default = _default;