// var pushNotifications = require(); 
var Firebase 	= require("../models/firebase");
var Post 		= require("../models/post");
var User 		= require("../models/user");
var Media 		= require("../models/media");
var Comment 	= require("../models/comment");
var ObjectId 	= require('mongodb').ObjectId;
var Chat        = require("../models/chat");
var moment      = require('moment');

var rp = require("request-promise");

var notifyNewFollower = async (req, res) => {
	// notify user about new following
	var following = await User.findOne({_id: ObjectId(req.body.following_id)}).then(user => user);
	var follower = await User.findOne({_id: ObjectId(req.body.user_id)}).then(user => user);

	await Firebase.findOne({user_id: ObjectId(req.body.following_id)}).then(device => {
		// get targeted devices
		if(device !== null){
			var query = {
				to: device.device_token,
				notification: {
					title: `Zlay`,
					body: `${follower.username} is now following you`
				},
				data: {
					title: `Zlay`,
					body: `${follower.username} is following you`,
					image: follower.avatar
				}
			}

			fireEvent(query).then(val => {
				res.status(200).json({status: "success", message: "Fcm notifications sent!", data: val})
			}).catch(err => {
				res.status(500).json({status: "error", message: "Error sending notificaitons", data: err})
			})
		}else{
			res.status(200).json({status: "success", message: "no device token found!", data: device})
		}
	});
}

var notifyNewTimelinePost = (req, res) => {
	// hold on buddy
}

var notifyNewMessage = async (req, res) => {
	// notify receiver about new message
	var receiver = await User.findOne({_id: ObjectId(req.body.receiver_id)}).then(user => user);
	var sender 	= await User.findOne({_id: ObjectId(req.body.sender_id)}).then(user => user);
	var message = req.body.message;
	var chat_id = req.body.chat_id;

	await Firebase.findOne({user_id: ObjectId(req.body.receiver_id)}).then(device => {
		// get targeted devices
		if(device !== null){

			Chat.findOne({_id: chat_id}).then(chat => {
				var messages = {
					message: {
						_id: chat._id,
		                sender_id: chat.sender_id,
		                receiver_id: chat.receiver_id,
		                body: chat.body,
		                status:chat.status,
		                createdAt: moment(chat.createdAt).startOf('minute').fromNow(),
		                updatedAt: moment(chat.updatedAt).startOf('minute').fromNow(),
					},
					from: sender,
					to: receiver,
					host: false
				}

				var query = {
					to: device.device_token,
					notification: {
						title: `${sender.username}`,
						body: `${message}`
					},
					data: {
						title: `${sender.username}`,
						body: `${message}`,
						image: sender.avatar,
						event: messages
					}
				}

				fireEvent(query).then(val => {
					res.status(200).json({status: "success", message: "Fcm notifications sent!", data: val})
				}).catch(err => {
					res.status(500).json({status: "error", message: "Error sending notificaitons", data: err})
				})
			})
		}else{
			res.status(200).json({status: "success", message: "no device token found!", data: device})
		}
	});
}

var pushChatMessage = async (req, chat) => {
	return new Promise( async (resolve, reject) => {
		// notify receiver about new message
		var receiver = await User.findOne({_id: ObjectId(req.body.receiver_id)}).then(user => user);
		var sender   = await User.findOne({_id: ObjectId(req.body.sender_id)}).then(user => user);
		var message  = req.body.message;
		var payload_response = req.body.payload_response;
		payload_response = JSON.parse(payload_response);

		await Firebase.findOne({user_id: ObjectId(req.body.receiver_id)}).then(device => {
			// get targeted devices
			if(device !== null){
				var query = {
					to: device.device_token,
					notification: {
						title: `${sender.username}`,
						body: `${message}`
					},
					data: {
						title: `${sender.username}`,
						body: `${message}`,
						image: sender.avatar,
						chat: payload_response
					}
				}

				fireEvent(query).then(val => {
					resolve(val)
				}).catch(err => {
					reject(err)
				})
			}else{
				resolve({status: "info", message: "Device not registered for push notifications!"});
			}
		});
	});
}

var notifyNewTimelinePostLike = async (req, res) => {
	// notify user about new timeline post
	var post = await Post.findOne({_id: ObjectId(req.body.post_id)}).then(post => post); // post origin
	var user = await User.findOne({_id: ObjectId(req.body.user_id)}).then(user => user); // user who owns the post
	var media = await Media.findOne({post_id: ObjectId(req.body.post_id)}).then(media => media); // post media file
	var device = await Firebase.findOne({user_id: ObjectId(post.user_id)}).then(device => device); // get owner device
 
	// get targeted devices
	if(device !== null){
		var query = {
			"to": device.device_token,
			"notification": {
				"title": `Timeline`,
				"body": `${user.username} like your timeline post`
			},
			"data": {
				"title": `Timeline`,
				"body": `${user.username} like your timeline post`,
				"image": media.media_url
			}
		}

		fireEvent(query).then(val => {
			res.status(200).json({status: "success", message: "Fcm notifications sent!", data: val})
		}).catch(err => {
			res.status(500).json({status: "error", message: "Error sending notificaitons", data: err})
		})
	}else{
		res.status(200).json({status: "success", message: "no device token found!", data: device})
	}	
}

var notifyNewComment = async (req, res) => {
	// notify user about comment
	var post = await Post.findOne({_id: ObjectId(req.body.post_id)}).then(post => post);
	var user = await User.findOne({_id: ObjectId(req.body.user_id)}).then(user => user);
	var media = await Media.findOne({post_id: ObjectId(req.body.post_id)}).then(media => media);

	// get post owner device
	await Firebase.findOne({user_id: ObjectId(post.user_id)}).then(device => {
		// get targeted devices
		if(device !== null){
			var query = {
				to: device.device_token,
				notification: {
					title: `${post.contents}`,
					body: `${user.username} comment on your post`
				},
				data: {
					title: `Timeline`,
					body: `${user.username} comment on your post`,
					image: media.media_url
				}
			}

			fireEvent(query).then(val => {
				res.status(200).json({status: "success", message: "Fcm notifications sent!", data: parsedBody})
			}).catch(err => {
				res.status(500).json({status: "error", message: "Error sending notificaitons", data: err})
			})
		}else{
			res.status(200).json({status: "success", message: "no device token found!", data: device})
		}
	});
}

var getRegisteredDevice = async (req, res) => {
	await Firebase.find().then(devices => {
		res.status(200).json({status: "success", message: "all devices retreived successfully", data: devices})
	}).catch(err => {
		res.status(500).json({status: "error", message: "error retreiving all registered devices", data: err})
	})
}

var fireEvent = (query) => {
	return new Promise((resolve, reject) => {
		var options = {
		    method: 'POST',
		    uri: 'https://fcm.googleapis.com/fcm/send',
		    headers: {
		    	"Authorization": "key=AAAAM6OO-8s:APA91bGxMEX9CX-QnS-79qjH-AIke0XTu5XlmqifbLimtcy6BDPudoNVxFTV1e-0XhrGVFx1VSMEo1-dbz__iVT5ghRzbPV2Q2_p8YQ0XRoYDJUosTFIcRhTGHQ7jIC-kDuaw39E4D0v",
		    	"Content-Type": "application/json"
		    },
		    body: query,
		    json: true // Automatically stringifies the body to JSON
		}

		rp(options).then(function (parsedBody) {
	        console.log(parsedBody)
	        resolve(parsedBody)
	    }).catch(function (err) {
	        console.log(err)
	        reject(err)
	    });
	});
}

module.exports = {
	notifyNewComment: notifyNewComment,
	notifyNewTimelinePost: notifyNewTimelinePost,
	notifyNewTimelinePostLike: notifyNewTimelinePostLike,
	getRegisteredDevice: getRegisteredDevice,
	notifyNewFollower: notifyNewFollower,
	notifyNewMessage: notifyNewMessage,
	pushChatMessage: pushChatMessage
}