require('dotenv').config();
var request 		= require('request-promise');
var jwt         	= require('jsonwebtoken');
var jwtSecret 	    = process.env.JWT_SECRET;
var jwtExpiry		= process.env.JWT_EXPIRY;
var deviceSecret 	= process.env.DEVICE_SECRET;
var welcomeMail 	= require('../mails/welcome-mail');
var resetLinkMail 	= require('../mails/reset-password-mail');
var mailTransport   = require('../config/mail-driver');

var signinUser = async (req, res) => {
	var query = {
	    uri: `${process.env.API_ENDPOINT}/auth/signin`,
	    method: 'POST',
	    headers: {
	        'Content-Type': 'application/json'
	    },
	    body: req.body,
	    json: true
	};
 
	var response = await request(query).then(results => results).catch(err => err);
	if(response.status == "success"){
		// sign JWT
		var signature 	= JSON.stringify(response);
		var token 		= jwt.sign({ api: signature }, jwtSecret, {expiresIn: "7d"});

		// set a global user
		req.session.token 	= token;
		req.session.user 	= response.data;
		response.token = token;
	}
	res.status(200).json(response);
}

var signupUser = async (req, res) => {
	var query = {
	    uri: `${process.env.API_ENDPOINT}/auth/signup`,
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

var sendActivationLink = async (req, res) => {
	var names 			= req.body.names;
	var activation_link = req.body.activation_link;
	var email           = req.body.email;

	var welcomeTemplate = welcomeMail(names, email, activation_link);
	var data = await mailTransport.send2(welcomeTemplate);
 
	res.status(200).json(data);
}

var activateAccount = async(req, res) => {
	console.log(req.query.link);
	var query = {
	    uri: `${process.env.API_ENDPOINT}/auth/activate?link=${req.query.link}`,
	    method: 'GET',
	    headers: {
	        'Content-Type': 'application/json'
	    },
	    json: true
	};
 
	var response = await request(query).then(results => results).catch(err => err);
	// res.status(200).json(response);
	res.redirect(`/?account_cgi_status=${response.message}`);
}

var sendResetLink = async(req, res) => {
	var reset_link 	= req.body.reset_link;
	var email  		= req.body.email;

	var resetLinkMail = welcomeMail(email, reset_link);
	var data = await mailTransport.send(resetLinkMail);
 
	res.status(200).json(data);
}

var resetPassword = async(req, res) => {
	console.log(req.query.link);
	var query = {
	    uri: `${process.env.API_ENDPOINT}/auth/reset?link=${req.query.link}`,
	    method: 'GET',
	    headers: {
	        'Content-Type': 'application/json'
	    },
	    body: JSON.stringify(req.body),
	    json: true
	};
 
	var response = await request(query).then(results => results).catch(err => err);
	res.status(200).json(response);
}

var verifyEmail = async (req, res) => {
	var query = {
	    uri: `${process.env.API_ENDPOINT}/auth/verify-email`,
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

// var initSystemDefault = async(req, res) => {
// 	var query = {
// 	    uri: `${process.env.API_ENDPOINT}/init/system/accounts/${req.body.user_id}`,
// 	    method: 'POST',
// 	    headers: {
// 	        'Content-Type': 'application/json'
// 	    },
// 	    body: req.body,
// 	    json: true
// 	};
 
// 	var response = await request(query).then(results => results).catch(err => err);
// 	res.status(200).json(response);
// }

module.exports = {
	signinUser: signinUser,
	signupUser: signupUser,
	sendActivationLink: sendActivationLink,
	activateAccount: activateAccount,
	sendResetLink: sendResetLink,
	resetPassword: resetPassword,
	verifyEmail: verifyEmail
	// initSystemDefault: initSystemDefault
}