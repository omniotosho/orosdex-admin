var connection = require('../database/connect');
var ObjectId   = require('mongodb').ObjectId;

// user schema
const videoSchema = new connection.Schema({
  user_id: {type: connection.Schema.Types.ObjectId, required: true},
  post_id: {type: connection.Schema.Types.ObjectId, required: true},
  file_url: {type: Number, required: true},
  status: {type: Number, required: false}
},{
	timestamps: true,
	autoIndex: false
});

const Video = connection.model('Video', videoSchema);
Video.createIndexes();

Video.addNewVideo = async (req, res) => {
	
}

module.exports = Video;