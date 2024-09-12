require("dotenv").config();
var mongoose = require('mongoose');
var MongoClient = require('mongodb').MongoClient

// check application state
var db_url;

if(process.env.NODE_ENV == 'developement'){
	db_url = process.env.DATABASE;
}else if(process.env.NODE_ENV == 'production'){
	db_url = process.env.DATABASE;
}else{
	// fallback to local
	db_url = process.env.DATABASE;
}

// database connection
mongoose.connect(db_url, { 
	useNewUrlParser: true,
	useUnifiedTopology: true
}).then(conn => console.log(`Database connected to tridex_db`));

// init promise
mongoose.Promise 	= global.Promise;

// export database configuration
module.exports = mongoose;

