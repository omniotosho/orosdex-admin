require('dotenv').config();
var request 	= require('request-promise');

var index = (req, res) => {
	var user = req.session.user;
	res.render('./loans', {user: user})
}

var addOne = async (req, res) => {

	//push file details
    var query = {
	    uri: `${process.env.API_ENDPOINT}/loan/add`,
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

var fetchAll = async (req, res) => {
	//push file details
    var query = {
	    uri: `${process.env.API_ENDPOINT}/loan/all`,
	    method: 'GET',
	    headers: {
	        'Content-Type': 'application/json'
	    },
	    json: true
	};

	var response = await request(query).then(results => results).catch(err => err);
	res.status(200).json(response);
}

module.exports = {
	index: index,
	addOne: addOne,
	fetchAll: fetchAll
}