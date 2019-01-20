import dynamoose from 'dynamoose';
import uuidv4 from 'uuid/v4';
import { encrypt, decrypt } from 'lib/kms';

const UserSchema = new dynamoose.Schema(
  {
    id: {
      type: String,
      default() {
        return uuidv4();
      },
      hashKey: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      index: {
        global: true,
      },
    },
    password: {
      type: String,
      required: true,
    },
    studentId: {
      type: String,
      required: true,
      index: {
        global: true,
      },
    },
    studentPw: {
      type: String,
      required: true,
      set: {
        isAsync: true,
        set(v, cb) {
          encrypt(v).then((data) => {
            cb(data);
          });
        },
      },
      get: {
        isAsync: true,
        get(v, cb) {
          decrypt(v).then((data) => {
            cb(data);
          });
        },
      },
    },
    studentValidate: {
      type: Boolean,
      default: false,
    },
    name: {
      type: String,
    },
    department: {
      type: String,
    },
    status: {
      type: String,
    },
    grade: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

const User = dynamoose.model(process.env.USER_DYNAMODB_TABLE, UserSchema);

export default User;
