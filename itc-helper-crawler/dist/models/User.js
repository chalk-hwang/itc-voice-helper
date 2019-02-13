"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _dynamoose = _interopRequireDefault(require("dynamoose"));

var _v = _interopRequireDefault(require("uuid/v4"));

var _kms = require("lib/kms");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const UserSchema = new _dynamoose.default.Schema({
  id: {
    type: String,

    default() {
      return (0, _v.default)();
    },

    hashKey: true
  },
  email: {
    type: String,
    trim: true,
    required: true,
    index: {
      global: true
    }
  },
  password: {
    type: String,
    required: true
  },
  studentId: {
    type: String,
    required: true,
    index: {
      global: true
    }
  },
  studentPw: {
    type: String,
    required: true,
    set: {
      isAsync: true,

      set(v, cb) {
        (0, _kms.encrypt)(v).then(data => {
          cb(data);
        });
      }

    },
    get: {
      isAsync: true,

      get(v, cb) {
        (0, _kms.decrypt)(v).then(data => {
          cb(data);
        });
      }

    }
  },
  studentValidate: {
    type: Boolean,
    default: false
  },
  name: {
    type: String
  },
  department: {
    type: String
  },
  status: {
    type: String
  },
  grade: {
    type: String
  }
}, {
  timestamps: true
});

const User = _dynamoose.default.model(process.env.DYNAMODB_TABLE_USER, UserSchema);

var _default = User;
exports.default = _default;