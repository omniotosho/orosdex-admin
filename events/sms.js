var ObjectId 	= require('mongodb').ObjectId;
var rp 			= require("request-promise");

// SMS API Configuration
var api_user = "ekpoto.liberty@gmail.com";
var api_pass = "idorliberty12";

var sendPushSms = async (req, res) => {
	var message = req.body.message;
	var sender  = req.body.sender;
	var mobiles = req.body.mobiles;

	var queryString = `?username=${api_user}&password=${api_pass}&message=${message}&sender=${sender}&mobiles=${mobiles}`

	await fireSms(queryString).then(val => {
		console.log(val);
		res.status(200).json({status: "success", message: "SMS notifications sent!", data: val})
	}).catch(err => {
		console.log(err)
		res.status(500).json({status: "error", message: "Error sending SMS notifications!", data: err})
	});
}

var fireSms = (query) => {
	return new Promise((resolve, reject) => {
		var options = {
		    method: 'GET',
		    uri: 'https://account.kudisms.net/api/'+query,
		    headers: {
		    	"Content-Type": "application/json"
		    },
		    body: query,
		    json: true // Automatically stringifies the body to JSON
		}

		rp(options).then(function (parsedBody) {
	        resolve(parsedBody)
	    }).catch(function (err) {
	        reject(err)
	    });
	});
}

module.exports = {
	sendPushSms: sendPushSms
}