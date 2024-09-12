/** Author Ekpoto Liberty
*** This is a legacy code for General Ledger.
*/

var index = async (req, res) => {
	var user = req.session.user;
	res.render('./gls', {user: user});
}

var addOne = async (req, res) => {
	var response = {
		status: "success",
		message: "GL successful!"
	}
	res.status(200).json(response);
}

var fetchOne = async (req, res) => {
	var response = {
		status: "success",
		message: "Test response"
	}
	res.status(200).json(response);
}

var fetchAll = async (req, res) => {
	var response = {
		status: "success",
		message: "Test response"
	}
	res.status(200).json(response);
}

var updateOne = async (req, res) => {
	var response = {
		status: "success",
		message: "Test response"
	} 
	res.status(200).json(response);
}

var deleteOne = async (req, res) => {
	var response = {
		status: "success",
		message: "Test response"
	}
	res.status(200).json(response);
}


module.exports = {
	index: index,
	addOne: addOne
}