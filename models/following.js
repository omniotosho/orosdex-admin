var connection = require('../database/connect');
var ObjectId   = require('mongodb').ObjectId;

// following schema
const followingSchema = new connection.Schema({
  	user_id: {type: connection.Schema.Types.ObjectId, required: true},
  	following_id: {type: connection.Schema.Types.ObjectId, required: true},
  	status: {type: Number, required: false}
},{
	timestamps: true,
	autoIndex: false
});

const Following = connection.model('Following', followingSchema);
Following.createIndexes();

Following.addNewFollowing = async (req, res) => {
	var query = {
		user_id: req.headers['user_id'],
		following_id: req.body['following_id'],
		status: 0,
	}

	await new Following(query).save().then(following => {
		res.status(200).json({status: "success", message: `You are now following user with id ${query.user_id}`, data: following});
	}).catch(err => {
		res.status(500).json({status: "error", message: `error following user with id ${query.user_id}`, data: err})
	});
}

Following.getFollowingByUserId = async (req, res) => {
	await Following.aggregate([{
		$match: {user_id: ObjectId(req.headers['user_id'])}
	},{
		$sort: {createdAt: -1}
	},{
		$lookup: {
			from: 'users',
			localField: 'following_id',
			foreignField: '_id',
			as: 'user',
		}
	},{
		$unwind: "$user"
	}]).then(following => {
		res.status(200).json({status: "success", message: `Following retrieved`, data: following})
	}).catch(err => {
		res.status(500).json({status: "error", message: `error on follower request...`, data: err})
	});
}

Following.countTotal = async (req, res) => {
	await Following.countDocuments({user_id: ObjectId(req.headers['user_id'])}).then(total => {
		res.status(200).json({status: "success", message: "Total following", data: total});
	}).catch(err => {
		res.status(500).json({status: "error", message: "error counting following", data: err});
	})
}

module.exports = Following;