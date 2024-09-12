var connection = require('../database/connect');
var ObjectId   = require('mongodb').ObjectId;

// firebase schema
const firebaseSchema = new connection.Schema({
  user_id: {type: connection.Schema.Types.ObjectId, required: true},
  device_token: {type: String, required: true},
  status: {type: Number, required: false}
},{
	timestamps: true,
	autoIndex: false
});

const Firebase = connection.model('Firebase', firebaseSchema);
Firebase.createIndexes();

Firebase.addUserDevice = async (req, res) => {
	var query = {
		user_id: req.headers['user_id'],
		device_token: req.body.device_token,
		status: 0
	}

	await Firebase.updateOne({user_id: ObjectId(req.headers['user_id'])}, query).then(val => {
		console.log(val)
		if(val.nModified > 0){
			res.status(200).json({status: "success", message: "User device token updated!", data: val});
		}else{
			new Firebase(query).save().then(val => {
				res.status(200).json({status: "success", message: "device saved!", data: val});
			}).catch(err => {
				res.status(500).json({status: "error", message: "error saving data", data: err});
			});
		}
	}).catch(err => {
		res.status(500).json({status: "error", message: "error saving data", data: err});
	})
}

Firebase.getUserDevice = async (req, res) => {
	await Firebase.find({user_id: ObjectId(req.headers['user_id'])}).then(val => {
		res.status(200).json({status: "success", message: "device token retrieved!", data: val});
	}).catch(err => {
		res.status(500).json({status: "error", message: "error retrieving device token", error: err});
	});
}

Firebase.getAllDevices = async (req, res) => {
	await Firebase.find({}).then(val => {
		res.status(200).json({status: "success", message: "all devices token retrieved!", data: val});
	}).catch(err => {
		res.status(500).json({status: "error", message: "error retrieving devices token", error: err});
	});
}


module.exports = Firebase;