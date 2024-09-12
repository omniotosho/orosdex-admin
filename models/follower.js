var connection = require('../database/connect');
var ObjectId   = require('mongodb').ObjectId;

// followers schema
const followerSchema = new connection.Schema({
    user_id: {type: connection.Schema.Types.ObjectId, required: true},
    follower_id: {type: connection.Schema.Types.ObjectId, required: true},
    status: {type: Number, required: false}
},{
	timestamps: true,
	autoIndex: false
});

const Follower = connection.model('Follower', followerSchema);
Follower.createIndexes();

Follower.addFollower = async (req, res) => {
	var query = {
		user_id: req.body['following_id'],
		follower_id: req.headers['user_id'],
		status: 0,
	}

	await new Follower(query).save().then(following => {
		res.status(200).json({status: "success", message: `${query.user_id} has a new follower with id: ${query.follower_id}`, data: following})
	}).catch(err => {
		res.status(500).json({status: "error", message: `error on following request...`, data: err})
	});
}

Follower.getFollowersByUserId = async (req, res) => {
	await Follower.aggregate([{
		$match: {user_id: ObjectId(req.headers['user_id'])}
	},{
		$sort: {createdAt: -1}
	},{
		$lookup: {
			from: 'users',
			localField: 'follower_id',
			foreignField: '_id',
			as: 'user',
		}
	},{
		$unwind: "$user"
	}]).then(following => {
		res.status(200).json({status: "success", message: `Followers retrieved`, data: following})
	}).catch(err => {
		res.status(500).json({status: "error", message: `error fetching followers`, data: err})
	});
}

Follower.countTotal = async (req, res) => {
	await Follower.countDocuments({user_id: ObjectId(req.headers['user_id'])}).then(total => {
		res.status(200).json({status: "success", message: "Total followers", data: total});
	}).catch(err => {
		res.status(500).json({status: "error", message: "error counting followers", data: err});
	})
}

module.exports = Follower;