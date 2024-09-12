var index = (req, res) => {
	var user = req.session.user;
	res.render('./settings', {user: user})
}

module.exports = {
	index: index
}