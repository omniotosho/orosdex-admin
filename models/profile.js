var connection = require('../database/connect');
var ObjectId   = require('mongodb').ObjectId;

// user schema
const profileSchema = new connection.Schema({
  user_id: {type: connection.Schema.Types.ObjectId, required: true},
  todo: {type: String, required: true},
  status: {type: Number, required: true}
},{
	timestamps: true,
	autoIndex: false
});

const Profile = connection.model('Profile', profileSchema);
Profile.createIndexes();

Profile.addNewTodo = async (req, res) => {
	var user_id = req.headers['user_id'];
	var todo 	= req.body.todo;
	var status 	= 0;

	await new Profile({user_id, todo, status}).save().then(todo => {
		res.status(200).json({status: "success", message: "Profile added!"});
	}).catch(err => {
		res.status(500).json(err);
	})
}


module.exports = Todo;