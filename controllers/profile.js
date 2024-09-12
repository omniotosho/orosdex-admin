require('dotenv').config();
var fs      = require('fs');
var path    = require('path');
var request = require('request-promise');

var index = (req, res) => {
	var user = req.session.user;
	console.log(user);
	res.render('./profile', {user: user})
}

var fetchProfile = async (req, res) => {
	var query = {
	    uri: `${process.env.API_ENDPOINT}/profile/${req.params.user_id}`,
	    method: 'GET',
	    headers: {
	        'Content-Type': 'application/json'
	    },
	    json: true
	}
 
	var response = await request(query).then(results => results).catch(err => err);
	res.status(200).json(response);
}

var fetchBasic = async (req, res) => {
	var query = {
	    uri: `${process.env.API_ENDPOINT}/auth/user/${req.params.user_id}`,
	    method: 'GET',
	    headers: {
	        'Content-Type': 'application/json'
	    },
	    json: true
	}
 
	var response = await request(query).then(results => results).catch(err => err);
	res.status(200).json(response);
}

var fetchUserBank = async (req, res) => {
	var query = {
	    uri: `${process.env.API_ENDPOINT}/bank/${req.params.user_id}`,
	    method: 'GET',
	    headers: {
	        'Content-Type': 'application/json'
	    },
	    json: true
	}
 
	var response = await request(query).then(results => results).catch(err => err);
	res.status(200).json(response);
}

var updateUserBank = async (req, res) => {
	var query = {
	    uri: `${process.env.API_ENDPOINT}/bank/${req.params.user_id}`,
	    method: 'PUT',
	    headers: {
	        'Content-Type': 'application/json'
	    },
	    body: req.body,
	    json: true
	}
 
	await request(query).then(results => results).catch(err => err);

	var response = {
		status: "success",
		message: "Update successful!"
	}
	res.status(200).json(response);
}

var updateProfile = async (req, res) => {
	var query = {
	    uri: `${process.env.API_ENDPOINT}/profile/${req.body.user_id}`,
	    method: 'PUT',
	    headers: {
	        'Content-Type': 'application/json'
	    },
	    body: req.body,
	    json: true
	}
 
	var response = await request(query).then(results => results).catch(err => err);
	res.status(200).json(response);
}

var updateAvatar = async (req, res) => {
	try {
		var query = {
		    uri: `${process.env.API_ENDPOINT}/user/avatar/${req.params.user_id}`,
		    method: 'PUT',
		    headers: {
		        'Content-Type': 'application/json'
		    },
		    body: {
		    	avatar: req.body.avatar_uri
		    },
		    json: true
		}
	 
		var response = await request(query).then(results => results).catch(err => err);

		setTimeout((t) => {
			res.status(200).json(response);
		}, 4000 * 5)
		
	} catch(e) {
		// statements
		console.log(e);
		response = {
			status: "error",
			message: "Internal server error!"
		}
		res.status(500).json(response);
	}	
}

var changePassword = async (req, res) => {
	var query = {
	    uri: `${process.env.API_ENDPOINT}/user/password/${req.params.user_id}`,
	    method: 'PUT',
	    headers: {
	        'Content-Type': 'application/json'
	    },
	    body: req.body,
	    json: true
	}
 
	var response = await request(query).then(results => results).catch(err => err);
	res.status(200).json(response);
}

module.exports = {
	index: index,
	fetchProfile: fetchProfile,
	updateProfile: updateProfile,
	updateAvatar: updateAvatar,
	fetchBasic: fetchBasic,
	fetchUserBank: fetchUserBank,
	updateUserBank: updateUserBank,
	changePassword: changePassword
}