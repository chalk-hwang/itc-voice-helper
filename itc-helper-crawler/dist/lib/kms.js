"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.decrypt = exports.encrypt = void 0;

var _awsSdk = _interopRequireDefault(require("aws-sdk"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const kmsClient = new _awsSdk.default.KMS();
const KeyId = process.env.KMS_KEY_ID;

const encrypt = async plaintext => {
  const data = await kmsClient.encrypt({
    KeyId,
    Plaintext: plaintext
  }).promise();
  const base64EncryptedString = data.CiphertextBlob.toString('base64');
  console.log(`base64 encrypted string: ${base64EncryptedString}`);
  return base64EncryptedString;
};

exports.encrypt = encrypt;

const decrypt = async chipertext => {
  const data = await kmsClient.decrypt({
    CiphertextBlob: Buffer.from(chipertext, 'base64')
  }).promise();
  console.log(data);
  return data.Plaintext.toString('ascii');
};

exports.decrypt = decrypt;