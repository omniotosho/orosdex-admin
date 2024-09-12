require('dotenv').config();
var request 	= require('request-promise');
var fs          = require('fs');
var path        = require('path');
var _           = require("lodash");

var index = async (req, res) => {

	if(!req.files){
		// return response
		res.status(200).json({status: "error", message: "No excel/csv file selected!"});
	}else{
        var media_file = req.files.media;
        console.log(media_file);

        var media_file_name = media_file.name.replace(/ /g,"_");
        var filtered_name = "tri_excel_" + new Date().getTime() + Math.floor(Math.random(9) * 999999) + ".csv"
        
        // move each media file to uploads directory
		media_file.mv('./public/excel/'+filtered_name);
		var file_url = 'http://localhost:3300/excel/'+filtered_name;
		
		var body_query = {
			file_name: media_file.name,
			file_url: file_url
		}

		//push file details
	    var query = {
		    uri: `${process.env.API_ENDPOINT}/customer/upload`,
		    method: 'POST',
		    headers: {
		        'Content-Type': 'application/json'
		    },
		    body: body_query,
		    json: true
		};

		var response = await request(query).then(results => results).catch(err => err);
		res.status(200).json(response);
	}		
}

module.exports = {
	index: index
}