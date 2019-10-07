const mongoose = require("mongoose");
var Schema = mongoose.Schema;

var IssueSchema = new Schema({
  issue_title: {
    type: String,
    required: true
  },
  issue_text: {
    type: String,
    required: true
  },
  created_by: {
    type: String,
    required: true
  },
  assigned_to: {
    type: String
  },
  status_text: {
    type: String
  },
  created_on: {
    type: Date
  },
  updated_on: {
    type: Date
  },
  open: {
    type: Boolean,
    defalut: true
  }
});

module.exports = mongoose.model("Issue", IssueSchema);
