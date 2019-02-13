"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.get = void 0;

var _profs = _interopRequireDefault(require("data/profs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const get = name => {
  const found = _profs.default[name];
  if (!found) return null;
  return {
    name,
    ...found
  };
};

exports.get = get;