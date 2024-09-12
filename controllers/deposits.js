var index = async (req, res) => {
	var user = req.session.user;
	res.render('./deposits', {user: user});
}

var processDeposit = async (req, res) => {
	var response = {
		status: "success",
		message: "Deposit successful!"
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
	processDeposit: processDeposit,
	fetchOne: fetchOne,
	fetchAll: fetchAll,
	updateOne: updateOne,
	deleteOne: deleteOne
}