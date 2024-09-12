var index = (req, res) => {
	var user = req.session.user;
	res.render('./treasury', {user: user})
}

module.exports = {
	index: index
}