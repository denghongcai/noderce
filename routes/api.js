var dateFormat = require('dateformat');
var db = require('../config').db;
var marked = require('marked');

db.bind("post");

exports.post = function (req, res) {
  db.post.find({}, {"content": 0}).sort({created: -1, _id: -1}).toArray(function (err, result) {
    if (!err) {
      res.send(result);
    } else {
      res.send({"code": 0, "message": "get post list failed, " + err});
    }
  });
};


// [GET], /api/post/:id
exports.get_post = function (req, res) {
  db.post.findOne({_id: db.ObjectID.createFromHexString(req.params.id)}, function (err, post) {
    if (!err) {
      res.send(post);
    } else {
      res.send({"code": 0, "message": "get post failed, " + err});
    }
  });
};


// [PUT], /api/post/:id
exports.update_post = function (req, res) {

  var created = dateFormat(new Date(), "yyyy-mm-dd");
  if (req.body.created)
    created = dateFormat(new Date(req.body.created), "yyyy-mm-dd");

  var post = {
    title: req.body.title,
    slug: req.body.slug,
    content: req.body.content,
    content_html: marked(req.body.content),
    created: created,
    tags: req.body.tags
  };

  db.post.update({_id: db.ObjectID.createFromHexString(req.body._id)}, {$set: post }, function (err, result) {
    if (!err)
      res.send({"code": 1, "message": "update post success"});
    else
      res.send({"code": 0, "message": "update post failed, " + err});
  });
};


// [POST], /api/post
exports.insert_post = function (req, res) {

  var created = dateFormat(new Date(), "yyyy-mm-dd");
  if (req.body.created)
    created = dateFormat(new Date(req.body.created), "yyyy-mm-dd");

  var post = {
    title: req.body.title,
    slug: req.body.slug,
    content: req.body.content,
    content_html: marked(req.body.content),
    created: created,
    tags: req.body.tags
  };

  db.post.insert(post, function (err, result) {
    if (!err) {
      res.send(result[0]);
    } else {
      res.send({"code": 0, "message": "create post failed, " + err});
    }
  });
};