var connection = require('../database/connect');
var ObjectId   = require('mongodb').ObjectId;

// user schema
const photoSchema = new connection.Schema({
  user_id: {type: connection.Schema.Types.ObjectId, required: true},
  post_id: {type: connection.Schema.Types.ObjectId, required: true},
  file_url: {type: Number, required: true},
  status: {type: Number, required: false}
},{
	timestamps: true,
	autoIndex: false
});

const Photo = connection.model('Photo', photoSchema);
Photo.createIndexes();

Photo.addNewPhoto = async (req, res) => {
	
}

module.exports = Photo;