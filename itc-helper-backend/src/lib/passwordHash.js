import bcrypt from 'bcryptjs';

export const hash = async (plaintext) => {
  try {
    const salt = await bcrypt.hash(plaintext, 10);
    return salt;
  } catch (e) {
    console.log(`[scrypt] hash error message : ${JSON.stringify(e)}`);
  }
};

export const verify = async (hashedtext, plaintext) => {
  try {
    const result = bcrypt.compare(plaintext, hashedtext);
    return result;
  } catch (e) {
    console.log(`[scrypt] verify error message : ${JSON.stringify(e)}`);
  }
};
