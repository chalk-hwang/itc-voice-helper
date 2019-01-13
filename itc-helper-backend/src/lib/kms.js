import AWS from 'aws-sdk';

const kmsClient = new AWS.KMS();
const KeyId = process.env.KMS_KEY_ID;

export const encrypt = async (plaintext) => {
  const data = await kmsClient
    .encrypt({
      KeyId,
      Plaintext: plaintext,
    })
    .promise();

  const base64EncryptedString = data.CiphertextBlob.toString('base64');
  console.log(`base64 encrypted string: ${base64EncryptedString}`);
  return base64EncryptedString;
};

export const decrypt = async (chipertext) => {
  const data = await kmsClient
    .decrypt({
      CiphertextBlob: Buffer.from(chipertext, 'base64'),
    })
    .promise();

  console.log(data);
  return data.Plaintext.toString('ascii');
};
