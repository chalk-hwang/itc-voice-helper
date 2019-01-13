import dynamoose from 'dynamoose';
import uuidv4 from 'uuid/v4';
import { encrypt, decrypt } from 'lib/ksm';

const SubjectSchema = new dynamoose.Schema({
  id: {
    type: String,
    default() {
      return uuidv4();
    },
    hashKey: true,
  },
  attendId: {
    type: String,
    required: true,
    index: {
      global: true,
    },
  },
  cyberId: {
    type: String,
    default(model) {
      const [,
        year,
        semesterCode,
        subjectCode,
        gradeClassCode,,,

        time,
      ] = model.attendId.split('|');
      const semester = Number(semesterCode.split('C')[1]);
      const gradeClass = gradeClassCode.split('_').join();
      return year + semester + gradeClass + subjectCode;
    },
    index: {
      global: true,
    },
  },
  title: {
    type: String,
    required: true,
  },
  scholarship: {
    type: String,
    required: true,
  },
  gradeClass: {
    type: String,
  },
  professor: {
    type: String,
  },
  week: {
    type: String,
  },
  time: {
    type: String,
  },
  lectureRecord: {
    type: [Object],
  },
});
