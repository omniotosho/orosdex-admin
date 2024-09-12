var index = (req, res) => {
	var user = req.session.user;
	res.render('./etfs', {user: user})
}

module.exports = {
	index: index
}