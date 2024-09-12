var connection = require('../database/connect');
var ObjectId   = require('mongodb').ObjectId;
var moment     = require('moment');
var User       = require('../models/user');

// user schema
const chatSchema = new connection.Schema({
	sender_id: {type: connection.Schema.Types.ObjectId, required: true},
	receiver_id: {type: connection.Schema.Types.ObjectId, required: true},
	body: {type: String, required: true},
	status: {type: Number, required: false}
},{
	timestamps: true,
	autoIndex: false
});

const Chat = connection.model('Chat', chatSchema);
Chat.createIndexes();

Chat.addNewChat = async (req, res) => {
	var query = {
		sender_id: req.body.sender_id,
		receiver_id: req.body.receiver_id,
		body: req.body.message,
		status: 0,
	}

	let sender = await User.findOne({_id: req.body.sender_id}).then(f => f)
	let receiver = await User.findOne({_id: req.body.receiver_id}).then(r => r)

	await new Chat(query).save().then((chat) => {

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
			host: true
		} 
		res.status(200).json({status: "success", message: "Chat saved!", data: messages})
	}).catch(err => {
		res.status(500).json({status: "error", message: "error saving chat!", data: err})
	});
}

Chat.getAllChat = async (req, res) => {
	var query = {
		sender_id: req.query.sender_id,
		receiver_id: req.query.receiver_id
	}

	var query2 = {
		sender_id: req.query.receiver_id,
		receiver_id: req.query.sender_id
	}

	var chat_box = [];
	var messages = await Chat.find({ $or: [query, query2] }).limit(15).then(messages => messages);
	for (var i = 0; i < messages.length; i++) {
		chat_box.push({
			message: {
				_id: messages[i]._id,
                sender_id: messages[i].sender_id,
                receiver_id: messages[i].receiver_id,
                body: messages[i].body,
                status:messages[i].status,
                createdAt: moment(messages[i].createdAt).startOf('minute').fromNow(),
                updatedAt: moment(messages[i].updatedAt).startOf('minute').fromNow(),
			},
			from: await User.findOne({_id: messages[i].sender_id}).then(f => f),
			to: await User.findOne({_id: messages[i].receiver_id}).then(r => r)
		});
	}

	res.status(200).json({status: "success", message: "Chat messages retreived!", data: chat_box})
}

module.exports = Chat;