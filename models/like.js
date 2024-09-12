var connection = require('../database/connect');
var ObjectId   = require('mongodb').ObjectId;

// user schema
const likeSchema = new connection.Schema({
  user_id: {type: connection.Schema.Types.ObjectId, required: true},
  post_id: {type: connection.Schema.Types.ObjectId, required: true},
  reaction: {type: String, required: false},
  status: {type: Number, required: false}
},{
	timestamps: true,
	autoIndex: false
});

const Like = connection.model('Like', likeSchema);
Like.createIndexes();

Like.addNewLike = async (req, res) => {
	let query = {
		user_id: req.headers['user_id'],
		post_id: req.headers['post_id'],
		reaction: req.body.reaction,
		status: 0
	}

	await Like(query).save().then(like => {
		res.status(200).json({status: "success", message: "like updated", data: like});
	}).catch(err => {
		res.status(500).json({status: "error", message: "error updating like!", data: err});
	});
}

Like.getPostLikes = async (req, res) => {
	
}

module.exports = Like;