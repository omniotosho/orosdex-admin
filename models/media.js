var connection  = require('../database/connect');
var ObjectId    = require('mongodb').ObjectId;
var Cloudinary  = require('cloudinary').v2;
var fs          = require('fs');
var path        = require('path');
var User        = require('../models/user');
var Throttle    = require('stream-throttle').Throttle;

// user schema
const mediaSchema = new connection.Schema({
  user_id: {type: connection.Schema.Types.ObjectId, required: true},
  post_id: {type: connection.Schema.Types.ObjectId, required: true},
  media_type: {type: Number, required: true},
  media_url: {type: String, required: true},
  status: {type: Number, required: false}
},{
	timestamps: true,
	autoIndex: false
});

const Media = connection.model('Media', mediaSchema);
Media.createIndexes();

Media.uploadProfileAvatar = (req, res) => {
	
}
 
Media.uploadMedia = async (req, res) => {
	let resCode;
	let status;
	let message;
	var file_url;

	var user_id     = req.headers["user_id"];
	var contents    = req.headers["contents"];
	var outDirVideo = path.join(__dirname, "../public/videos");
	var outDirImage = path.join(__dirname, "../public/images");
	var fileName 	= req.headers["file-name"];
	var fileType 	= req.headers["file-type"];

    try {
    	var mediaName = "upload_" + new Date().getTime() + "_" + fileName;
		var out;

    	if(fileType == "video"){
    		out = path.join(outDirVideo, mediaName);
    	}else if(fileType == "image"){
    		out = path.join(outDirImage, mediaName);
    	}

    	var writeStream = fs.createWriteStream(out);
		// var onThrottle  = await new Throttle({ rate: 1024 * 4096 });

	  	// req.pipe(onThrottle).pipe(writeStream);
	  	req.pipe(writeStream);

	  	status 	= "success";
	  	message = "Timeline post uploaded via stream!";
	  	resCode = 200;

	  	// file name
	  	file_url = mediaName;
	} catch(e) {
		status 	= "error";
	  	message = "Error processing upload stream!";
	  	resCode = 500;
		console.log(e);
	}

	req.on('end', function(){
		// upload to cloudinary
		var file_path;
		var cloud_path_config;
		if(fileType == "video"){
    		file_path = `http://zlayit.net/videos/${file_url}`;
    		cloud_path_config = {folder: "videos", resource_type: "video"}
    	}else if(fileType == "image"){
    		file_path = `http://zlayit.net/images/${file_url}`;
    		cloud_path_config = {folder: "photos", format: "jpg", crop: "fit", width: 640, height: 640}
    	}

		Cloudinary.uploader.upload(file_path, cloud_path_config, async function(error, result) {
			if(error){
				console.log(error);
				// console log data
			    res.status(500).json({status: "error", message: "uploading to cloud storage!", data: error});
			}
			if(result){
				console.log(result);	
				res.status(200).json({status: "success", message: "Timeline post is ready!", data: media_query});
			}
		});
	})
	// res.status(200).json({status: "success", message: "Timeline post is ready!", data: 'https://cloudinary.com'});
}

module.exports = Media;
