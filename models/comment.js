var connection = require('../database/connect');
var ObjectId   = require('mongodb').ObjectId;
var moment     = require('moment');

// user schema
const commentSchema = new connection.Schema({
  user_id: {type: connection.Schema.Types.ObjectId, required: true},
  post_id: {type: connection.Schema.Types.ObjectId, required: true},
  body: {type: String, required: true},
  status: {type: Number, required: false}
},{
	timestamps: true,
	autoIndex: false
});

const Comment = connection.model('Comment', commentSchema);
Comment.createIndexes();

Comment.addNewComment = async (req, res) => {
	var query = {
		post_id: req.headers['post_id'],
		user_id: req.headers['user_id'],
		body: req.body.comment,
		status: 0,
	}

	await new Comment(query).save().then(comment => {
		res.status(200).json({status: "success", message: "comment saved!", data: comment})
	}).catch(err => {
		res.status(500).json({status: "error", message: "error saving comment!", data: err})
	});
}

Comment.getCommentsByPostId = async (req, res) => {
	await Comment.find({post_id: ObjectId(req.headers['post_id'])}).then(comment => {
		res.status(200).json({status: "success", message: "comment retreived!", data: comment})
	}).catch(err => {
		res.status(500).json({status: "error", message: "error retrieving comments!", data: err})
	});
}

module.exports = Comment;