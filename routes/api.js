/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";

// require('dotenv').config();
var expect = require("chai").expect;
// var MongoClient = require("mongodb");
const mongooseConfig = require("../config/mongoose_config");
var mongo = require("mongodb");
var mongoose = require("mongoose");
var ObjectId = require("mongodb").ObjectID;

const Issue = require("./issue");

const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});

mongoose.connect(CONNECTION_STRING, mongooseConfig);

const db = mongoose.connection;

module.exports = function(app) {
  var obj = new ObjectId();

  app
    .route("/api/issues/:project")

    .get(function(req, res) {
      var project = req.params.project;

      var filter = {};
      var title = req.query.issue_title;
      var issue_t = req.query.issue_text;
      var by = req.query.created_by;
      var to = req.query.assigned_to;
      var status_t = req.query.status_text;
      var created = req.query.created_on;
      var updated = req.query.updated_on;
      var open = req.query.open;

      if (title) {
        filter = { issue_title: title };
      }
      if (issue_t) {
        filter = { issue_text: issue_t };
      }
      if (by) {
        filter = { created_by: by };
      }
      if (to) {
        filter = { assinged_to: to };
      }
      if (status_t) {
        filter = { status_text: status_t };
      }
      if (created) {
        var s_created = created.split("-");
        var year = Number(s_created[0]);
        var month = Number(s_created[1]);
        var day = Number(s_created[2]) + 1;
        var next_created = year + "-" + month + "-" + day;
        filter = { created_on: { $gte: created, $lt: next_created } };
      }
      if (updated) {
        var s_updated = updated.split("-");
        var year = Number(s_updated[0]);
        var month = Number(s_updated[1]);
        var day = Number(s_updated[2]) + 1;
        var next_updated = year + "-" + month + "-" + day;
        filter = { created_on: { $gte: updated, $lt: next_updated } };
      }
      if (open) {
        filter = { open: open };
      }

      Issue.find(filter, function(err, alldata) {
        if (alldata) {
          res.send(alldata);
        } else {
          req.flash("error", err.errors);
        }
      });
    })

    .post(function(req, res, next) {
      // var project = req.params.project;

      var issue = new Issue();

      if (
        !req.body.issue_title ||
        !req.body.issue_text ||
        !req.body.created_by
      ) {
        return res.send("Missing required fields");
      } else {
        issue.issue_title = req.body.issue_title;
        issue.issue_text = req.body.issue_text;
        issue.created_by = req.body.created_by;
        issue.assigned_to = req.body.assigned_to || "";
        issue.status_text = req.body.status_text || "";
        issue.created_on = new Date(
          parseInt(obj.toString().substr(0, 8), 16) * 1000
        );
        issue.open = true;

        issue.save(function(err, issue) {
          if (err) {
            return res.send("Could not save");
          }
          res.json(issue);
          //   res.json({
          //   _id: issue._id,
          //   issue_title: issue.issue_title,
          //   issue_text: issue.issue_text,
          //   created_on: issue.created_on,
          //   created_by: issue.created_by,
          //   assigned_to: issue.assigned_to,
          //   open: issue.open,
          //   status_text: issue.status_text
          // });
        });
      }
    })

    .put(function(req, res, next) {
      // var project = req.params.project;

      var issue = new Issue();

      Issue.findOne({ _id: req.body._id }, function(err, data, next) {
        if (!req.body._id) {
          res.send("No body");
        } else {
          if (!data) {
            res.send("no id found");
          }
          if (data) {
            issue._id = req.body._id;
          }
          if (req.body.issue_title) {
            issue.issue_title = req.body.issue_title;
          }
          if (req.body.issue_text) {
            issue.issue_text = req.body.issue_text;
          }
          if (req.body.created_by) {
            issue.created_by = req.body.created_by;
          }
          if (req.body.assigned_to) {
            issue.assigned_to = req.body.assigned_to;
          }
          if (req.body.status_text) {
            issue.status_text = req.body.status_text;
          }
          if (req.body.open) {
            issue.open = false;
          }

          issue.updated_on = new Date(
            parseInt(obj.toString().substr(0, 8), 16) * 1000
          );

          Issue.findOneAndUpdate(
            { _id: req.body._id },
            { $set: issue },
            function(error, result) {
              if (error) {
                res.send("Could not update");
              } else {
                res.send("Updated suceed");
              }
            }
          );

          console.log(issue);
        }
      });
    })

    .delete(function(req, res) {
      // var project = req.params.project;

      Issue.findById(req.body._id, function(err, data) {
        if (!data) {
          res.send("No ID found");
        } else {
          Issue.findByIdAndRemove(req.body._id, function(err, data) {
            if (err) {
              console.log("failed delete");
              res.send("could not delete" + data._id);
            } else {
              console.log("Deleted");
              res.send("deleted:" + data._id);
            }
          });
        }
      });
    });
};
