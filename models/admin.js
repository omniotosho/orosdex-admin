var connection      = require('../database/connect');
var bcrypt          = require('bcryptjs');
var ObjectId        = require('mongodb').ObjectId;
var moment          = require("moment");
var jwt         	= require('jsonwebtoken');
var jwtSecret 	    = process.env.JWT_SECRET;
var jwtExpiry		= process.env.JWT_EXPIRY;
var deviceSecret 	= process.env.DEVICE_SECRET;

// Admin schema
const AdminSchema = new connection.Schema({
    names: {type: String, required: true},
    username: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true, lowercase: true},
    phone: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    avatar: {type: String, required: false},
    gender: {type: Number, required: false},
    status: {type: Number, required: true}
},{
	timestamps: true,
	autoIndex: false
});

const Admin = connection.model('Admin', AdminSchema);
Admin.createIndexes();

// create new Admin
Admin.signupUser = async (req, res) => {
    var email   	= req.body.email;
    var names       = req.body.names;
    var username    = req.body.username;
    var phone       = req.body.phone;
    var password    = bcrypt.hashSync(req.body.password, 10);
    var status      = 1;
    var gender      = req.body.gender || 0;
    var avatar      = "https://res.cloudinary.com/zlayit/image/upload/v1564871012/photos/avatar_fohncb.ico";

    // create new Admin
    await new Admin({email, username, names, phone, password, status, gender, avatar}).save().then(admin => {
        res.status(200).json({status: "success", message: "Registration successful!", data: admin});
    }).catch(err => {
        res.status(400).json({status: "error", message: "Server error!",  err: err});
    });
}

Admin.authenticate = async (req, res) => {
	// console log value
	var email 		= req.body.email;
	var password 	= req.body.password;

	// fetch data
	await Admin.findOne({email: email}, function(err, user) {
		if(err) return res.status(500).json({status: "error", message: err});

		// console log value
		if(user == null) return res.status(404).json({status: "error", message: "Invalid email/password!"});
		// console log value

		// compare password
		bcrypt.compare(password, user.password, function(err, isMatch){
			// check password
			if(err){
				throw err; 
			}else if(isMatch === true){
				// sign JWT
				var signature 	= JSON.stringify(user);
				var token 		= jwt.sign({ api: signature }, jwtSecret, {expiresIn: "7d"});

				// exclude password key
				delete user.password;

				// set a global user
				req.session.token 	= token;
				req.session.user 	= user;
				req.session.isLogin = true;

				// console log data
				// console.log(req.session.user);

				// return res.redirect('/dashboard');
				return res.status(200).json({status: "success", message: "Login successul!", data: token});
				// return next();
			}else{
				return res.status(200).json({status: "error", message: "Incorrect password!"});
			}
		});
	});
}

// export model
module.exports = Admin;