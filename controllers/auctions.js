require('dotenv').config();
var fs      = require('fs');
var path    = require('path');
var request = require('request-promise');

var index = async (req, res) => {
	var user = req.session.user;
	res.render('./auctions', {user: user})
}

var postEquityPrices = async (req, res) => {
	var query = {
	    uri: `${process.env.API_ENDPOINT}/equity`,
	    method: 'POST',
	    headers: {
	        'Content-Type': 'application/json'
	    },
	    body: req.body,
	    json: true
	}
 
	var response = await request(query).then(results => results).catch(err => err);
	res.status(200).json(response);
}

var getEquityPrices = async (req, res) => {
	var query = {
	    uri: `${process.env.API_ENDPOINT}/etfs`,
	    method: 'GET',
	    headers: {
	        'Content-Type': 'application/json'
	    },
	    json: true
	}
 
	var response = await request(query).then(results => results).catch(err => err);
	res.status(200).json(response);
}

var postEtfsPrices = async (req, res) => {
	var query = {
	    uri: `${process.env.API_ENDPOINT}/etfs`,
	    method: 'POST',
	    headers: {
	        'Content-Type': 'application/json'
	    },
	    body: req.body,
	    json: true
	}
 
	var response = await request(query).then(results => results).catch(err => err);
	res.status(200).json(response);
}

var getEtfsPrices = async (req, res) => {
	var query = {
	    uri: `${process.env.API_ENDPOINT}/etfs`,
	    method: 'GET',
	    headers: {
	        'Content-Type': 'application/json'
	    },
	    json: true
	}
 
	var response = await request(query).then(results => results).catch(err => err);
	res.status(200).json(response);
}

var postTreasuryPrices = async (req, res) => {
	var query = {
	    uri: `${process.env.API_ENDPOINT}/treasury`,
	    method: 'POST',
	    headers: {
	        'Content-Type': 'application/json'
	    },
	    body: req.body,
	    json: true
	}
 
	var response = await request(query).then(results => results).catch(err => err);
	res.status(200).json(response);
}

var getTreasuryPrices = async (req, res) => {
	var query = {
	    uri: `${process.env.API_ENDPOINT}/treasury`,
	    method: 'GET',
	    headers: {
	        'Content-Type': 'application/json'
	    },
	    json: true
	}
 
	var response = await request(query).then(results => results).catch(err => err);
	res.status(200).json(response);
}

var postBondsPrices = async (req, res) => {
	var query = {
	    uri: `${process.env.API_ENDPOINT}/bonds`,
	    method: 'POST',
	    headers: {
	        'Content-Type': 'application/json'
	    },
	    body: req.body,
	    json: true
	}
 
	var response = await request(query).then(results => results).catch(err => err);
	res.status(200).json(response);
}

var getBondsPrices = async (req, res) => {
	var query = {
	    uri: `${process.env.API_ENDPOINT}/bonds`,
	    method: 'GET',
	    headers: {
	        'Content-Type': 'application/json'
	    },
	    json: true
	}
 
	var response = await request(query).then(results => results).catch(err => err);
	res.status(200).json(response);
}

module.exports = {
	index: index,
	postEquityPrices: postEquityPrices,
	getEquityPrices: getEquityPrices,
	postEtfsPrices: postEtfsPrices,
	getEtfsPrices: getEtfsPrices,
	postTreasuryPrices: postTreasuryPrices,
	getTreasuryPrices: getTreasuryPrices,
	postBondsPrices: postBondsPrices,
	getBondsPrices: getBondsPrices,
}