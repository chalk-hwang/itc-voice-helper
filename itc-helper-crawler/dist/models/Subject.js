"use strict";

var _dynamoose = _interopRequireDefault(require("dynamoose"));

var _v = _interopRequireDefault(require("uuid/v4"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const SubjectSchema = new _dynamoose.default.Schema({
  id: {
    type: String,

    default() {
      return (0, _v.default)();
    },

    hashKey: true
  },
  attendId: {
    type: String,
    required: true,
    index: {
      global: true
    }
  },
  cyberId: {
    type: String,

    default(model) {
      const [, year, semesterCode, subjectCode, gradeClassCode,,, time] = model.attendId.split('|');
      const semester = Number(semesterCode.split('C')[1]);
      const gradeClass = gradeClassCode.split('_').join();
      return year + semester + gradeClass + subjectCode;
    },

    index: {
      global: true
    }
  },
  title: {
    type: String,
    required: true
  },
  scholarship: {
    type: String,
    required: true
  },
  gradeClass: {
    type: String
  },
  professor: {
    type: String
  },
  week: {
    type: String
  },
  time: {
    type: String
  },
  lectureRecord: {
    type: [Object]
  }
});