var connection 	= require('../database/connect');
var ObjectId   	= require('mongodb').ObjectId;
var Media       = require("./media");
var Like        = require("./like");
var Comment     = require("./comment");
var moment      = require("moment");
var User        = require("./user");

// user schema
const postSchema = new connection.Schema({
  	user_id: {type: connection.Schema.Types.ObjectId, required: true},
  	contents: {type: String, required: false},
  	status: {type: Number, required: false}
},{
	timestamps: true,
	autoIndex: false
});

const Post = connection.model('Post', postSchema);
Post.createIndexes();

Post.addNewPost = async (req, res) => {
	var user_id 	= req.headers['user_id'];
	var caption 	= req.body.caption;
	var media_type 	= req.body.media_type;
	var media_files = req.body.media;

	let query = {
		user_id: user_id,
		contents: req.body.caption
	}

	// save contents to posts
	await new Post(query).save().then(post => {
		var total_upload = 0;
		for (var i = 0; i < media_files.length; i++) {
			let media_query = {
				user_id: user_id,
				post_id: post._id,
				media_type: media_type,
				media_url: media_files[i],
				status: false
			}

			// save file url to media
			new Media(media_query).save().then(val => {
				total_upload++;
				console.log(val)
			}).catch(err => {
				console.log(err);
			})
		}
		
		res.status(200).json({status: "success", message: "Timeline post is ready!", data: total_upload});
	}).catch(err => {
		console.log(err);
		res.status(500).json({status: "error", message: "Error sending timeline post!", data: err});
	})
}

Post.getAllUsersPosts = async (req, res) => {
	var posts = await Post.aggregate([{
		$sort: {createdAt: -1}
	},{
		$lookup: {
			from: 'users',
			localField: 'user_id',
			foreignField: '_id',
			as: 'user',
		},
	}]).then(posts => posts).catch(err => []);
	// console.log(posts);
	var posts_box = [];
	var like_text = ' ';

	// for loop
	for (var i = 0; i < posts.length; i++) {
		var post = {
			_id: posts[i]._id,
            user_id: posts[i].user_id,
            contents: posts[i].contents,
            status: posts[i].status,
            createdAt: moment(posts[i].createdAt).startOf('minute').fromNow(),
            updatedAt: posts[i].updatedAt,
		}

		var likes = await Like.countDocuments({post_id: ObjectId(posts[i]._id)});
		var like_count = parseFloat(likes);
		if(like_count > 1){
			like_text = `${like_count} likes`;
		}else{
			if(like_count == 1){
				like_text = `${like_count} new like`;
			}else{
				if(like_count == 0){
					like_text = ` `;
				}
			}
		}

		var media = await Media.find({post_id: ObjectId(posts[i]._id), media_type: 1}).then(media => media);
		if(media.length > 0){
			posts_box.push({
				post: post,
				user: posts[i].user[0],
				media: media,
				likes: like_text,
				comments: await Comment.find({post_id: ObjectId(posts[i]._id)}).then(comments => comments),
			});	
		}	
	}

	res.status(200).json({status: "success", message: "Timeline retreived successful!", posts: posts_box});
}

Post.getAllUsersVideoPosts = async (req, res) => {
	var posts = await Post.aggregate([{
		$sort: {createdAt: -1}
	},{
		$lookup: {
			from: 'users',
			localField: 'user_id',
			foreignField: '_id',
			as: 'user',
		},
	}]).then(posts => posts).catch(err => []);
	// console.log(posts);
	var posts_box = [];
	var like_text = ' ';

	// for loop
	for (var i = 0; i < posts.length; i++) {
		var post = {
			_id: posts[i]._id,
            user_id: posts[i].user_id,
            contents: posts[i].contents,
            status: posts[i].status,
            createdAt: moment(posts[i].createdAt).startOf('minute').fromNow(),
            updatedAt: posts[i].updatedAt,
		}

		var likes = await Like.countDocuments({post_id: ObjectId(posts[i]._id)});
		var like_count = parseFloat(likes);
		if(like_count > 1){
			like_text = `${like_count} likes`;
		}else{
			if(like_count == 1){
				like_text = `${like_count} new like`;
			}else{
				if(like_count == 0){
					like_text = ` `;
				}
			}
		}

		var media = await Media.find({post_id: ObjectId(posts[i]._id), media_type: 2}).then(media => media);
		if(media.length > 0){
			posts_box.push({
				post: post,
				user: posts[i].user[0],
				media: media,
				likes: like_text,
				comments: await Comment.find({post_id: ObjectId(posts[i]._id)}).then(comments => comments),
			});	
		}
	}

	res.status(200).json({status: "success", message: "Videos Timeline retreived successful!", posts: posts_box});
}

Post.getPostById = async (req, res) => {
	let data = {};
	await Post.aggregate([{
		$sort: {createdAt: -1}
	},{
		$match: {_id: ObjectId(req.params.postId)}
	},{
		$lookup: {
			from: 'users',
			localField: 'user_id',
			foreignField: '_id',
			as: 'user',
		}
	},{
		$unwind: '$user'
	}]).then(post => {
		console.log(post)
		// post.createdAt = moment(post.createdAt).startOf('hour').fromNow()
		data.post = post[0]
	}).catch(err => []);

	var count_likes 	= await Like.countDocuments({post_id: ObjectId(data.post._id)});
	var count_comments 	= await Comment.countDocuments({post_id: ObjectId(data.post._id)});
	var post_comments 	= await Comment.aggregate([{
		$sort: {createdAt: -1}
	},{
		$match: {post_id: ObjectId(req.params.postId)}
	},{
		$lookup: {
			from: 'users',
			localField: 'user_id',
			foreignField: '_id',
			as: 'user',
		}
	},{
		$unwind: '$user'
	}]).then(comment => {
		comment.map(val => val.createdAt = moment(val.createdAt).startOf('minute').fromNow())
		return comment;
	});
	var post_media 		= await Media.find({post_id: ObjectId(data.post._id)}).then(media => media);
	
	data.total_likes 	= count_likes;
	data.total_comments = count_comments;
	data.comments 		= post_comments;
	data.media 			= post_media;

	res.status(200).json({status: "success", message: "Timeline retreived successful!", posts: data});
}

Post.getRecent = async (req, res) => {
	var posts = await Post.find({user_id: ObjectId(req.headers['user_id'])}).sort({createdAt: -1}).then(posts => posts).catch(err => console.log(err));
	var posts_box = [];

	// for loop
	for (var i = 0; i < posts.length; i++) {
		posts_box.push({
			post: posts[i],
			media: await Media.findOne({post_id: ObjectId(posts[i]._id)}).then(media => media)
		})	
	}

	res.status(200).json({status: "success", message: "Recent timeline post retrieved successful!", posts: posts_box});
}

Post.getAllRecentPost = async (req, res) => {
	var posts = await Post.find({}).sort({createdAt: -1}).then(posts => posts).catch(err => console.log(err));
	var posts_box = [];

	// for loop
	for (var i = 0; i < posts.length; i++) {
		posts_box.push({
			post: posts[i],
			media: await Media.findOne({post_id: ObjectId(posts[i]._id)}).then(media => media)
		})	
	}

	res.status(200).json({status: "success", message: "Recent timeline post retrieved successful!", posts: posts_box});
}

Post.getTotal = async (req, res) => {
	var totalPost = 0;
	var posts = await Post.countDocuments({user_id: ObjectId(req.headers['user_id'])}).then(total => {
		totalPost = total
	}).catch(err => {
		totalPost = 0
		console.log(err)
	});

	res.status(200).json({status: "success", message: "count post successful!", total: totalPost});
}

Post.deletePost = async (req, res) => {
	// delete data
	await Post.remove({_id: ObjectId(req.params.postId)}).then(val => {
		res.status(200).json({status: "success", message: "deleted data!", data: val});
	}).catch(err => {
		res.status(500).json({status: "error", message: "deleted data!", data: err});
	})
}

module.exports = Post;