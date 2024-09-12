var index = (req, res) => {
	var user = req.session.user;
	res.render('./savings', {user: user})
}

module.exports = {
	index: index
}