require('dotenv').config();
var request 	= require('request-promise');
var fs          = require('fs');
var path        = require('path');
var _           = require("lodash");

var index = (req, res) => {
	var user = req.session.user;

	res.render('./clients', {user: user})
}

// create customer
var add = async (req, res) => {

	if(!req.files){
		// return response
		req.body.passport = "http://localhost:3300/img/avatar.png"; 
	}else{

        var media_file = req.files.media;
        var media_file_name = media_file.name.replace(/ /g,"_");

        var filtered_name = "tri_" + new Date().getTime() + Math.floor(Math.random(9) * 999999) + ".jpg"
        
        // move each media file to uploads directory
		media_file.mv('./public/img/'+filtered_name);
		var passport = 'http://localhost:3300/img/'+filtered_name;

		// tag passport
		req.body.passport = passport; 
	}

	//push file details
    var query = {
	    uri: `${process.env.API_ENDPOINT}/customer/add`,
	    method: 'POST',
	    headers: {
	        'Content-Type': 'application/json'
	    },
	    body: req.body,
	    json: true
	};

	var response = await request(query).then(results => results).catch(err => err);
	res.status(200).json(response);
}

// var fetch all
var fetchAll = async (req, res) => {
	//push file details
    var query = {
	    uri: `${process.env.API_ENDPOINT}/customer/all`,
	    method: 'GET',
	    headers: {
	        'Content-Type': 'application/json'
	    },
	    body: req.body,
	    json: true
	};

	var response = await request(query).then(results => results).catch(err => err);
	res.status(200).json(response);
}

// var update all
var updateOne = async (req, res) => {

	if(!req.files){
		// return response
		req.body.passport = req.body.passport; 
	}else{

        var media_file = req.files.media;
        var media_file_name = media_file.name.replace(/ /g,"_");

        var filtered_name = "tri_" + new Date().getTime() + Math.floor(Math.random(9) * 999999) + ".jpg"
        
        // move each media file to uploads directory
		media_file.mv('./public/img/'+filtered_name);
		var passport = 'http://localhost:3300/img/'+filtered_name;

		// tag passport
		req.body.passport = passport; 
	}

	// push file details
    var query = {
	    uri: `${process.env.API_ENDPOINT}/customer/one/${req.body.id}`,
	    method: 'PUT',
	    headers: {
	        'Content-Type': 'application/json'
	    },
	    body: req.body,
	    json: true
	};

	var response = await request(query).then(results => results).catch(err => err);
	res.status(200).json(response);
}

module.exports = {
	index: index,
	add: add,
	fetchAll: fetchAll,
	updateOne: updateOne,
}