"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.get = void 0;

var _subDepts = _interopRequireDefault(require("data/subDepts"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const get = name => {
  const found = _subDepts.default[name];
  if (!found) return null;
  return {
    name,
    ...found
  };
};

exports.get = get;