var request = require('request');

var registerUser = async (req, res) => {
    return res.status(200).json({status: "success", message: "Registration successul!", data: ''});
}

// export model
module.exports = {
    registerUser: registerUser
}