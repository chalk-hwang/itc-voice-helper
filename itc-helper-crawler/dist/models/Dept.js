"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAllNames = exports.get = void 0;

var _depts = _interopRequireDefault(require("data/depts"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const get = name => {
  const found = _depts.default[name];
  if (!found) return null;
  return {
    name,
    ...found
  };
};

exports.get = get;

const getAllNames = () => {
  return Object.keys(_depts.default);
};

exports.getAllNames = getAllNames;