var index = (req, res) => {
	var user = req.session.user;
	res.render('./bonds', {user: user})
}

module.exports = {
	index: index
}