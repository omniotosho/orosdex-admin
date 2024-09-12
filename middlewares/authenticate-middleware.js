/**
* Author: Ekpoto Liberty Bernard
* Version: 1.0.2
* Signature: delino12
* web api middleware
*/
const jwt 			= require('jsonwebtoken');
const bcrypt    	= require('bcryptjs');
const jwtSecret 	= process.env.JWT_SECRET;
const jwtExpiry		= process.env.JWT_EXPIRY;
const deviceSecret 	= process.env.DEVICE_SECRET;

// check user login
exports.isLogin = (req, res, next) => {
	// get verified token access
	const token = req.session.token;
	// console.log(req.session.user)
	if (token == null) return res.redirect('/');
	
	// invalid token
	jwt.verify(token, jwtSecret, function(err, decoded) {
	    // console.log(decoded);
	    if(err !== null){
	      	// check if error on jwt
	      	if(err.name === "JsonWebTokenError"){
	        	return res.redirect('/');
	     	}

	      	// check if expired jwt
	      	if(err.name === "TokenExpiredError"){
	        	return res.redirect('/');
	      	}
	    }else if(decoded.api === jwtSecret){
	      	if(decoded.iat < decoded.exp){
	        	return res.redirect('/');
	      	}
	    }else{
	    	// return
		    return next();
	    }
	});
}

// check if user session is still active
exports.isActive = (req, res, next) => {
	// get verified token access
	const token = req.session.token;

	// console.log(req.session.user)
	if(token) return res.redirect('/dashboard');
	
	return next();
}

// process login
exports.isAuth = (req, res, next) => {
	// get verified token access
	const token = session.token || null;
	
	if (token == null) return res.redirect('/');
	
	// invalid token
	jwt.verify(token, jwtSecret, function(err, decoded) {
	    // console.log(decoded);
	    if(err !== null){
	      	// check if error on jwt
	      	if(err.name === "JsonWebTokenError"){
	        	return res.status(200).json({status: false, message: "Error verifying token!"});
	     	}

	      	// check if expired jwt
	      	if(err.name === "TokenExpiredError"){
	        	return res.status(200).json({status: false, message: "Session expired!"});
	      	}
	    }else if(decoded.api === jwtSecret){
	      	if(decoded.iat < decoded.exp){
	        	return res.status(200).json({status: true, message: "Login successul!"});
	      	}
	    }else{
	    	// return
		    return next();
	    }
	});
}

// logout user
exports.logoutUser = (req, res, next) => {
	req.session.cookie.expires = 1000;
	req.session.token = null;
	
	res.redirect('/');
}